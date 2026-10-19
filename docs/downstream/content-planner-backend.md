# Downstream: content-planner-backend

Kurzfassung des Contracts für Menschen und Agents. Maßgeblich ist
`openapi/openapi.yaml` im Repo `hegerald/content-planner-backend` (wird beim Build erzeugt).

- Basis-URL lokal: `http://localhost:8081`
- Konfiguration im UI-Service: `quarkus.rest-client.content-planner-backend.url`

## Endpunkte

| Methode | Pfad | Zweck | Erfolg |
|---|---|---|---|
| GET | `/api/posts?status=&channel=` | Liste, sortiert nach Termin | 200 |
| GET | `/api/posts/{id}` | Einzelner Post | 200 |
| POST | `/api/posts` | Neuer Post (immer `DRAFT`) | 201 |
| PUT | `/api/posts/{id}` | Inhalt/Termin ändern | 200 |
| POST | `/api/posts/{id}/status` | Statuswechsel `{ "targetStatus": "..." }` | 200 |
| DELETE | `/api/posts/{id}` | Löschen | 204 |
| GET | `/api/channels` | Kanäle mit `maxLength` | 200 |

## Datenmodell `Post`
`id, title, text, channel, status, scheduledAt, publishedAt, createdAt, updatedAt,
editable, deletable, allowedTransitions[]` – Zeitpunkte als ISO-8601 in UTC.

- `channel`: `INSTAGRAM` (2200), `LINKEDIN` (3000), `X` (280), `FACEBOOK` (63206)
- `status`: `DRAFT` ⇄ `SCHEDULED` → `PUBLISHED` (Endzustand)

## Fehler
Einheitlich `{ "status": 422, "code": "TEXT_TOO_LONG", "message": "..." }`

| Code | HTTP | Bedeutung |
|---|---|---|
| `VALIDATION_FAILED` | 400 | Pflichtfeld fehlt o. Ä. |
| `NOT_FOUND` | 404 | Post existiert nicht |
| `TEXT_TOO_LONG` | 422 | Zeichenlimit des Kanals überschritten |
| `SCHEDULED_AT_REQUIRED` | 422 | Einplanen ohne Termin |
| `SCHEDULED_AT_IN_PAST` | 422 | Termin liegt nicht in der Zukunft |
| `INVALID_STATUS_TRANSITION` | 422 | Statuswechsel nicht erlaubt |
| `POST_NOT_EDITABLE` | 422 | Veröffentlichter Post kann nicht geändert werden |
| `POST_NOT_DELETABLE` | 422 | Veröffentlichter Post kann nicht gelöscht werden |
