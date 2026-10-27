# Content Planner – UI

Demo-Projekt für eine Session zu KI-gestützter Softwareentwicklung.
Enthält den **UI-Service** (Quarkus, Backend-for-Frontend) und das **Frontend** (Angular 22).

```
Angular-App (4200) ─► UI-Service (8080, /ui-api) ─► Backend (8081, /api)
                      └──────── dieses Repo ────┘    hegerald/content-planner-backend
```

Der UI-Service enthält keine Business-Logik. Er bereitet die Daten des Backends für die
Anzeige auf (Labels, erlaubte Aktionen als Buttons) und reicht Fehler unverändert weiter.
Eine selbst gebaute Oberfläche kann `/ui-api` genauso nutzen wie die Angular-App.

## Voraussetzungen
- JDK 25 oder neuer
- Maven 3.9 oder neuer, global installiert (`mvn -v`)
- Node.js 24.15+ LTS (oder 22.22.3+ / 26) mit npm 11 – ältere npm-10-Versionen brechen bei `npm install` ab
- Laufendes Backend (siehe Backend-Repo)

## Starten
```bash
# 1. Backend (im Backend-Repo)
mvn quarkus:dev

# 2. UI-Service
cd ui-service
mvn quarkus:dev            # http://localhost:8080/q/swagger-ui

# 3. Frontend
cd frontend
npm install
npm start                  # http://localhost:4200
```

## Testen
```bash
cd ui-service && mvn test   # Backend wird gemockt
cd frontend && npm test     # Vitest
node scripts/verify.mjs     # wie die CI: alle Teile, inkl. Backend-Nachbar-Repo
```

## Für KI-Agents
Dieser Branch nutzt bewusst **nur offene, werkzeugunabhängige Standards**. Projektregeln stehen
in [AGENTS.md](AGENTS.md), Skills im Agent-Skills-Format unter `.agents/skills/`, die Prüfung vor
dem Push als normaler Git-Hook unter `.githooks/`. Hook einmalig aktivieren:

```bash
git config core.hooksPath .githooks
```

Den GitHub-MCP-Server trägt jede Person im eigenen Werkzeug ein (siehe `AGENTS.md`).
Der Contract des Backends liegt in
[docs/downstream/](docs/downstream/content-planner-backend/index.md) – als Bundle im
[Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf) (Google, v0.2).
