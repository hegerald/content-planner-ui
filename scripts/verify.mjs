#!/usr/bin/env node
// Prüft den Content Planner genau wie die CI und meldet das Ergebnis pro Teil:
//   ui-service  Build und Tests (`mvn -B verify`), OpenAPI-Contract in ui-service/openapi/ aktuell?
//   frontend    `npm ci`, Tests (Vitest), Produktions-Build
//   okf         Wissens-Bundle docs/downstream/content-planner-backend (scripts/check-okf.py)
//   backend     Nachbar-Repo ../content-planner-backend über dessen scripts/verify.mjs (nur lokal)
// Die CI ruft dieses Skript pro Teil auf – lokal grün heißt damit auch in der CI grün.
//
// Aufruf: node scripts/verify.mjs [all|backend|ui-service|frontend|okf ...] [--quiet]
//   ohne Teil oder `all` = alles; mehrere Teile laufen parallel, ihre Ausgabe geht dann nur ins Log.
//   --quiet  auch bei einem einzelnen Teil nur Zusammenfassung statt voller Ausgabe
// Exit-Code 0 = alles grün (nicht geprüfte Teile zählen lokal nicht als Fehler), 1 = etwas ist rot.
import { spawn } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const backendRoot = join(root, "..", "content-planner-backend");
const inCi = !!process.env.GITHUB_ACTIONS;
const ALL = ["backend", "ui-service", "frontend", "okf"];

const args = process.argv.slice(2);
const requested = args.filter((arg) => !arg.startsWith("--"));
const unknown = requested.filter((part) => part !== "all" && !ALL.includes(part));
if (unknown.length) {
  console.error(`Unbekannter Teil: ${unknown.join(", ")} – erlaubt: all, ${ALL.join(", ")}`);
  process.exit(2);
}
const parts = !requested.length || requested.includes("all") ? ALL : ALL.filter((p) => requested.includes(p));
const stream = parts.length === 1 && !args.includes("--quiet");

const logDir = join(tmpdir(), "content-planner-verify");
mkdirSync(logDir, { recursive: true });

const stripAnsi = (text) => text.replace(/\x1b\[[0-9;]*m/g, "");

// Kommandozeile über die Shell, damit unter Windows `mvn.cmd`/`npm.cmd` gefunden werden.
// Nur feste Argumente bzw. Pfade aus diesem Skript, Pfade werden gequotet.
function run(commandLine, cwd, log, env) {
  return new Promise((resolve) => {
    const child = spawn(commandLine, { cwd, shell: true, env: { ...process.env, ...env } });
    let output = "";
    const onData = (chunk) => {
      output += chunk;
      log?.write(chunk);
      if (stream && log) process.stdout.write(chunk);
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("close", (status) => resolve({ status, output: stripAnsi(output) }));
    child.on("error", (error) => resolve({ status: -1, output: String(error) }));
  });
}

// Fehlerzeilen für die Zusammenfassung, ohne Mavens allgemeine Hilfe-Hinweise am Ende.
const MAVEN_NOISE = /^\[ERROR\]\s*$|\[Help 1\]|-e switch|-X switch|please read|dump files|surefire-reports for/;
const errorLines = (output) =>
  output
    .split(/\r?\n/)
    .filter((line) => /ERROR|Error|FAIL|✗|×/.test(line) && !MAVEN_NOISE.test(line))
    .slice(-40)
    .join("\n");

async function step(part, body) {
  const started = Date.now();
  const logPath = join(logDir, `${part}.log`);
  const log = createWriteStream(logPath);
  const result = { part, status: "ok", tests: "–", contract: "–", note: "", details: "" };
  try {
    Object.assign(result, await body(log));
  } finally {
    await new Promise((resolve) => log.end(resolve));
  }
  return { ...result, seconds: Math.round((Date.now() - started) / 1000), log: logPath };
}

// Backend: dessen eigenes Skript, damit die Prüfung nur an einer Stelle definiert ist.
const backend = (log) => {
  const script = join(backendRoot, "scripts", "verify.mjs");
  if (!existsSync(script)) {
    return { status: "skipped", note: "Nachbar-Repo ../content-planner-backend fehlt" };
  }
  return run(`"${process.execPath}" "${script}" --quiet --json`, backendRoot, log).then(({ output }) => {
    const last = output.trim().split(/\r?\n/).at(-1);
    try {
      const { status, tests, contract, details } = JSON.parse(last);
      return { status, tests, contract, details };
    } catch {
      return { status: "failed", details: output.slice(-4000) };
    }
  });
};

async function uiService(log) {
  const cwd = join(root, "ui-service");
  const build = await run("mvn -B verify", cwd, log);
  const totals = build.output
    .split(/\r?\n/)
    .map((line) => line.match(/Tests run: (\d+), Failures: (\d+), Errors: (\d+), Skipped: (\d+)\s*$/))
    .filter(Boolean)
    .at(-1);
  const tests = totals ? `${totals[1] - totals[2] - totals[3] - totals[4]}/${totals[1]}` : "–";
  if (build.status !== 0) return { status: "failed", tests, details: errorLines(build.output) };

  // Unter Windows (core.autocrlf) zeigt `git status` nach dem Build oft „M …/openapi.yaml“, obwohl
  // nur der Zeilenumbruch abweicht. `git diff --exit-code` vergleicht den Inhalt und ist maßgeblich.
  const diff = await run("git diff --quiet --exit-code -- openapi/", cwd);
  const contract = diff.status === 0 ? "aktuell" : diff.status === 1 ? "geändert" : "unbekannt";
  if (contract === "aktuell") return { tests, contract };
  if (inCi) console.log("::error::ui-service/openapi/ ist veraltet – mvn package ausführen und committen");
  return {
    status: "failed",
    tests,
    contract,
    details: "ui-service/openapi/ ist veraltet – `mvn package` ausführen und die Dateien mit committen.",
  };
}

async function devServerRunning() {
  try {
    await fetch("http://localhost:4200", { signal: AbortSignal.timeout(1000) });
    return true;
  } catch {
    return false;
  }
}

async function frontend(log) {
  const cwd = join(root, "frontend");
  const modules = join(cwd, "node_modules", ".package-lock.json");
  const lock = join(cwd, "package-lock.json");
  const upToDate = existsSync(modules) && statSync(modules).mtimeMs >= statSync(lock).mtimeMs;

  // In der CI immer frisch installieren. Lokal `npm ci` auslassen, wenn node_modules aktuell ist:
  // es löscht node_modules und würde einem laufenden `npm start` die Dateien wegziehen.
  let note = "";
  if (inCi || !upToDate) {
    if (!inCi && (await devServerRunning())) {
      return {
        status: "failed",
        note: "node_modules veraltet, aber `npm start` läuft",
        details: "Dev-Server auf 4200 stoppen, dann erneut prüfen (`npm ci` würde ihn stören).",
      };
    }
    const install = await run("npm ci", cwd, log);
    if (install.status !== 0) return { status: "failed", details: errorLines(install.output) || install.output.slice(-4000) };
  } else {
    note = "npm ci übersprungen (node_modules aktuell)";
  }

  const test = await run("npm test -- --watch=false", cwd, log);
  const summary = test.output.match(/^\s*Tests\s+(.*)\((\d+)\)\s*$/m);
  const tests = summary ? `${summary[1].match(/(\d+) passed/)?.[1] ?? 0}/${summary[2]}` : "–";
  if (test.status !== 0) return { status: "failed", tests, note, details: errorLines(test.output) };

  const build = await run("npm run build", cwd, log);
  if (build.status !== 0) return { status: "failed", tests, note, details: errorLines(build.output) };
  return { tests, note };
}

// Unter Windows sind `python3`/`python` oft nur der Platzhalter des Microsoft Store (Exit 9009).
async function findPython() {
  for (const candidate of ["python3", "python", "py -3"]) {
    const { status, output } = await run(`${candidate} --version`, root);
    if (status === 0 && /Python 3/.test(output)) return candidate;
  }
  return null;
}

async function okf(log) {
  const python = await findPython();
  if (!python) {
    // In der CI ist Python immer da – fehlt es dort, ist das ein Fehler, lokal nur ein Hinweis.
    return { status: inCi ? "failed" : "skipped", note: "Python 3 fehlt" };
  }
  const check = await run(
    `${python} scripts/check-okf.py docs/downstream/content-planner-backend`,
    root,
    log,
    { PYTHONIOENCODING: "utf-8" }
  );
  const summary = check.output.match(/(\d+) Dateien geprüft, (\d+) Fehler/);
  const tests = summary ? `${summary[1] - summary[2]}/${summary[1]}` : "–";
  if (check.status === 0) return { tests };
  return { status: "failed", tests, details: check.output.split(/\r?\n/).filter((l) => l.startsWith("FEHLER")).join("\n") };
}

const steps = { backend, "ui-service": uiService, frontend, okf };
const results = await Promise.all(parts.map((part) => step(part, steps[part])));

const label = { ok: "grün", failed: "ROT", skipped: "nicht geprüft" };
const rows = [
  ["Teil", "Ergebnis", "Tests", "Contract", "Dauer", "Hinweis"],
  ...results.map((r) => [r.part, label[r.status], r.tests, r.contract, `${r.seconds} s`, r.note]),
];
const widths = rows[0].map((_, i) => Math.max(...rows.map((row) => row[i].length)));
console.log("\n" + rows.map((row) => row.map((cell, i) => cell.padEnd(widths[i])).join("  ").trimEnd()).join("\n"));

for (const r of results.filter((r) => r.details)) {
  console.log(`\n── ${r.part} ──\n${r.details}`);
}
console.log(`\nLogs: ${logDir}`);
process.exit(results.some((r) => r.status === "failed") ? 1 : 0);
