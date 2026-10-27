# content-planner-ui

Oberflächen-Schicht des Content Planners. Zwei Teile in einem Repo:

| Ordner | Was | Port |
|---|---|---|
| `ui-service/` | Quarkus Backend-for-Frontend, REST unter `/ui-api` | 8080 |
| `frontend/` | Angular-App, ruft nur `/ui-api` auf (Proxy in `proxy.conf.json`) | 4200 |

## Wichtigstes Prinzip
**Keine Business-Logik in diesem Repo.** Regeln (Zeichenlimits, erlaubte Statuswechsel,
Termine) prüft ausschließlich das Backend. Der UI-Service übersetzt nur in Anzeige-Modelle
(Labels, Buttons), das Frontend zeigt an, was der UI-Service liefert.
Grund: Nutzer können sich eigene Oberflächen bauen – das System muss trotzdem korrekt bleiben.
- Was erlaubt ist, kommt vom Backend (`editable`, `deletable`, `allowedTransitions` → `actions`).
- Fehler des Backends (Status, `code`, `message`) werden unverändert durchgereicht und angezeigt.
- Prüfungen im Frontend nur als Komfort (Pflichtfeld, Zeichenzähler), nie als einzige Prüfung.

## Downstream-Service
- `content-planner-backend` (Repo `hegerald/content-planner-backend`), lokal http://localhost:8081
- Wissen über das Backend: OKF-Bundle `docs/downstream/content-planner-backend/` (Einstieg `index.md`; Regeln, Fehlercodes, Modelle als einzelne Konzepte). Maßgeblich ist `openapi/openapi.yaml` im Backend-Repo. Prüfen: `python3 scripts/check-okf.py docs/downstream/content-planner-backend`
- Client: `ui-service/src/main/java/at/contentplanner/ui/backend/BackendClient.java`
- Braucht ein Feature neue Daten oder Regeln, zuerst das Backend erweitern, dann hier anbinden.

## Arbeiten über beide Repos
- Der Agent wird in diesem Repo gestartet; das Backend liegt daneben unter `../content-planner-backend`
  (im eigenen Werkzeug als zusätzliches Verzeichnis bzw. Workspace-Ordner freigeben).
- Dessen Regeln werden nicht automatisch geladen: **vor Änderungen im Backend
  `../content-planner-backend/AGENTS.md` lesen.**

## Entwicklungsablauf
Anforderung → `/refine-requirement` (Issue) → `/implement-issue <nr>` (Plan, Tests, Umsetzung)
→ Skill `review-change` in eigenem Kontext (unabhängige Prüfung) → Commit + Pull Request.
- Issues und PRs: Repo `hegerald/content-planner-ui`, Label `refined` für verfeinerte Issues.
  Backend-PRs verlinken das Issue.
- Komponenten-Reihenfolge bei Features: Backend → UI-Service → Frontend.
- API-Änderungen: Skill `contract-change` befolgen.
- Die SDLC-Skills (`refine-requirement`, `implement-issue`, `review-change`) sind
  projektunabhängig und liegen hier nur zum Zeigen; projektspezifisch sind `contract-change`,
  `start-services` und `verify-all`.

## Befehle
- UI-Service: `cd ui-service && mvn quarkus:dev` · Tests: `mvn test` (Backend wird gemockt)
- Frontend: `cd frontend && npm install && npm start` · Tests: `npm test` · Build: `npm run build`
- Für die ganze Kette zuerst das Backend starten (`mvn quarkus:dev` im Backend-Repo).
  Alles auf einmal: Skill `start-services` (Backend → UI-Service → Frontend, mit Health-Checks).
- Alle Builds und Tests wie die CI (beide Repos, inkl. Contract und OKF-Check):
  `node scripts/verify.mjs [backend|ui-service|frontend|okf]` – dasselbe Skript nutzen CI und
  Git-Hook `pre-push`; Auswertung per Skill `verify-all`. Was geprüft wird, nur im Skript ändern.

## Konventionen
- Java: Quarkus 3.40, Records für DTOs, `@ClientExceptionMapper` für Downstream-Fehler.
- Angular 22: Standalone-Komponenten, Signals, neue Control-Flow-Syntax (`@if`, `@for`),
  Signal Forms, `inject()` statt Konstruktor-Injection, keine NgModules.
- Code und Bezeichner Englisch; Texte in der Oberfläche, Kommentare und Doku Deutsch.

## Agent-Konfiguration in diesem Repo (offene Standards, werkzeugunabhängig)
- `AGENTS.md` (diese Datei) – Projektregeln
- `.agents/skills/` – Skills im Agent-Skills-Format: `refine-requirement`, `implement-issue`,
  `review-change`, `contract-change`, `start-services`, `verify-all`
- `.githooks/pre-push` – Git-Hook: `scripts/verify.mjs` (UI-Service, Frontend, OKF) muss vor
  `git push` grün sein. Einmalig aktivieren: `git config core.hooksPath .githooks`
- MCP: GitHub-MCP-Server `https://api.githubcopilot.com/mcp/` (HTTP) im eigenen Werkzeug
  eintragen. Anmeldung per OAuth oder mit Token aus einer Umgebungsvariable – nie ein Token einchecken.

## Regeln für Agents
- Vor `git commit` und `git push` immer nachfragen. Kein Force-Push, kein `git reset --hard`.
- `.env`-Dateien (auch im Backend-Repo) nicht lesen und keine Secrets in Code, Issues oder Pull Requests schreiben.
- Den Git-Hook nicht umgehen (`--no-verify`).
- Erlaubt ohne Rückfrage: Tests und Builds (`mvn test`, `mvn package`, `npm test`, `npm run build`,
  `node scripts/verify.mjs`) und lesende Git-Befehle (`git status`, `git diff`, `git log`, `git branch`).
