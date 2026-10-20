---
name: start-services
description: Startet den Content Planner lokal – Backend (8081, Nachbar-Repo), UI-Service (8080) und Angular-Frontend (4200) – in der richtigen Reihenfolge als Hintergrundprozesse und prüft jede Stufe. Verwenden, wenn die App laufen soll, zum Ausprobieren oder um eine Änderung im Browser zu sehen. Optional nur einzelne Teile, z. B. `/start-services frontend`.
argument-hint: "[all|backend|ui-service|frontend]"
---

# Content Planner lokal starten

```
Frontend (4200) ─► UI-Service (8080, /ui-api) ─► Backend (8081, /api)
frontend/          ui-service/                   ../content-planner-backend
```

Argument: `$ARGUMENTS` – leer oder `all` = alles; sonst nur die genannten Teile.
Fehlt eine Stufe darunter, trotzdem mitstarten (Frontend braucht UI-Service, der braucht das Backend).

## Grundregeln
- Jeden Server als **Hintergrundprozess** starten (`run_in_background`), nie im Vordergrund.
- Vor jedem Start prüfen, ob er schon läuft – dann überspringen. Belegten Port ohne gültige
  Antwort nicht einfach freiräumen, sondern den Nutzer fragen.
- Auf die „Listening“-Zeile im Log warten, statt mit `sleep` zu raten.
- Reihenfolge einhalten: Backend → UI-Service → Frontend.
- Werkzeuge sind global installiert und im PATH: JDK 25+ (`java -version`), Maven (`mvn -v`),
  Node.js (`node -v`). Keinen Maven-Wrapper und keinen Node-Versionsmanager verwenden.

## 1. Backend (Port 8081)
- Läuft schon? `curl -s http://localhost:8081/q/health/ready` → `"status": "UP"`.
- Start in `../content-planner-backend`:
  `mvn quarkus:dev -Dquarkus.console.enabled=false`
- Bereit bei `Listening on: http://localhost:8081`. Details: Skill `start-backend` im Backend-Repo
  (`../content-planner-backend/.claude/skills/start-backend/SKILL.md`).

## 2. UI-Service (Port 8080)
- Läuft schon? `curl -s http://localhost:8080/q/health/ready` → `"status": "UP"`.
- Start in `ui-service/`: `mvn quarkus:dev -Dquarkus.console.enabled=false`
- Bereit bei `Listening on: http://localhost:8080`.
- Kette prüfen: `curl -s http://localhost:8080/ui-api/posts` muss Posts liefern. Ein Fehler
  hier heißt meist: Backend läuft nicht.

## 3. Frontend (Port 4200)
- Läuft schon? `curl -s -o /dev/null -w "%{http_code}" http://localhost:4200` → `200`.
- Node.js 24.15+ mit npm 11 nötig (`node -v`, `npm -v`), global installiert (kein Versionsmanager
  wie fnm/nvm). Fehlt `node`, nicht selbst installieren, sondern den Nutzer fragen – meist ist nur
  der Editor/die Shell seit der Installation nicht neu gestartet.
- Fehlt `frontend/node_modules` oder ist `package-lock.json` neuer: `npm install` in `frontend/`.
- Start in `frontend/`: `npm start -- --no-open`
- Bereit bei `Local: http://localhost:4200/`. Die Zeile enthält ANSI-Farbcodes zwischen
  `Local`, `localhost:` und `4200` – nach `Watching for file changes` greppen oder per
  `curl` auf Port 4200 warten, nicht nach `localhost:4200` im Log suchen. Kette prüfen:
  `curl -s http://localhost:4200/ui-api/posts` (läuft über `proxy.conf.json` zum UI-Service).

## Abschluss
Kurz melden, was läuft (und was schon lief):
- App: http://localhost:4200
- UI-Service Swagger: http://localhost:8080/q/swagger-ui
- Backend Swagger: http://localhost:8081/q/swagger-ui

Alle drei Server laden Code-Änderungen selbst neu – nach Änderungen nicht neu starten.
