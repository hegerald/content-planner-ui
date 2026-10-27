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
- VS Code mit `content-planner.code-workspace` öffnen: Der Workspace enthält dieses Repo und das
  Backend daneben unter `../content-planner-backend`.
- **Vor Änderungen im Backend `../content-planner-backend/.github/copilot-instructions.md` lesen.**

## Entwicklungsablauf
Anforderung → `/refine-requirement` (Issue) → `/implement-issue <nr>` (Plan, Tests, Umsetzung)
→ Custom Agent `reviewer` als Subagent (unabhängige Prüfung) → Commit + Pull Request.
- Issues und PRs: Repo `hegerald/content-planner-ui`, Label `refined` für verfeinerte Issues.
  Backend-PRs verlinken das Issue.
- Komponenten-Reihenfolge bei Features: Backend → UI-Service → Frontend.
- API-Änderungen: Skill `contract-change` befolgen.
- Die SDLC-Skills (`refine-requirement`, `implement-issue`) und der Reviewer sind
  projektunabhängig und liegen hier nur zum Zeigen; projektspezifisch sind `contract-change`,
  `start-services` und `verify-all`.

## Befehle
- UI-Service: `cd ui-service && mvn quarkus:dev` · Tests: `mvn test` (Backend wird gemockt)
- Frontend: `cd frontend && npm install && npm start` · Tests: `npm test` · Build: `npm run build`
- Für die ganze Kette zuerst das Backend starten (`mvn quarkus:dev` im Backend-Repo).
  Alles auf einmal: Skill `start-services` (Backend → UI-Service → Frontend, mit Health-Checks).
- Alle Builds und Tests wie die CI (beide Repos, inkl. Contract und OKF-Check):
  `node scripts/verify.mjs [backend|ui-service|frontend|okf]` – dasselbe Skript nutzen CI und
  Push-Hook; Auswertung per Skill `verify-all`. Was geprüft wird, nur im Skript ändern.

## Konventionen
- Java: Quarkus 3.40, Records für DTOs, `@ClientExceptionMapper` für Downstream-Fehler.
- Angular 22: Standalone-Komponenten, Signals, neue Control-Flow-Syntax (`@if`, `@for`),
  Signal Forms, `inject()` statt Konstruktor-Injection, keine NgModules.
- Code und Bezeichner Englisch; Texte in der Oberfläche, Kommentare und Doku Deutsch.

## GitHub-Copilot-Konfiguration in diesem Repo
- `.github/copilot-instructions.md` (diese Datei) – Projektregeln, in jeder Sitzung geladen
- `.github/skills/` – Skills: `refine-requirement`, `implement-issue`, `contract-change`, `start-services`, `verify-all`
- `.github/agents/` – Custom Agents, z. B. `reviewer`
- `.github/hooks/` – Agent-Hook: `scripts/verify.mjs` (UI-Service, Frontend, OKF) muss vor `git push` grün sein; blockiert Force-Push und `git reset --hard`
- `.vscode/mcp.json` – GitHub-MCP-Server (Anmeldung per OAuth über das GitHub-Konto in VS Code, kein Token im Repo)
- `.vscode/settings.json` – Terminal-Befehle, die ohne Rückfrage laufen dürfen (`chat.tools.terminal.autoApprove`)
- `content-planner.code-workspace` – Multi-Root-Workspace mit dem Backend-Repo

## Regeln für den Agent
- Vor `git commit` und `git push` immer nachfragen. Kein Force-Push, kein `git reset --hard`.
- `.env`-Dateien (auch im Backend-Repo) nicht lesen und keine Secrets in Code, Issues oder Pull Requests schreiben.
