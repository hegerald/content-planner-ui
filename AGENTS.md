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
- Contract: `docs/downstream/content-planner-backend.md`; maßgeblich ist `openapi/openapi.yaml` im Backend-Repo
- Client: `ui-service/src/main/java/at/contentplanner/ui/backend/BackendClient.java`
- Braucht ein Feature neue Daten oder Regeln, zuerst das Backend erweitern, dann hier anbinden.

## Arbeiten über beide Repos
- Claude Code wird in diesem Repo gestartet; das Backend liegt daneben unter `../content-planner-backend`
  (in `.claude/settings.json` als zusätzliches Verzeichnis freigegeben).
- Dessen Regeln werden nicht automatisch geladen: **vor Änderungen im Backend
  `../content-planner-backend/AGENTS.md` lesen.**

## Entwicklungsablauf
Anforderung → `/refine-requirement` (Issue) → `/implement-issue <nr>` (Plan, Tests, Umsetzung)
→ Subagent `reviewer` (unabhängige Prüfung) → Commit + Pull Request.

## Befehle
- UI-Service: `cd ui-service && ./mvnw quarkus:dev` · Tests: `./mvnw test` (Backend wird gemockt)
- Frontend: `cd frontend && npm install && npm start` · Tests: `npm test` · Build: `npm run build`
- Für die ganze Kette zuerst das Backend starten (`./mvnw quarkus:dev` im Backend-Repo).

## Konventionen
- Java: Quarkus 3.40, Records für DTOs, `@ClientExceptionMapper` für Downstream-Fehler.
- Angular 22: Standalone-Komponenten, Signals, neue Control-Flow-Syntax (`@if`, `@for`),
  Signal Forms, `inject()` statt Konstruktor-Injection, keine NgModules.
- Code und Bezeichner Englisch; Texte in der Oberfläche, Kommentare und Doku Deutsch.
