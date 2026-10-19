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
- JDK 25 oder neuer, Maven 3.9+
- Node.js 24 LTS (oder 22.22+ / 26), npm
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
```

## Für KI-Agents
Projektregeln stehen in [AGENTS.md](AGENTS.md), der Contract des Backends in
[docs/downstream/](docs/downstream/content-planner-backend.md).
