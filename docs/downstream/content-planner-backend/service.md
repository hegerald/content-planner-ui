---
type: Service
title: Content Planner Backend
description: Downstream-Service mit der gesamten Business-Logik und Persistenz für geplante Social-Media-Posts.
resource: https://github.com/hegerald/content-planner-backend
tags: [downstream, backend, quarkus]
status: stable
generated:
  by: claude-opus-5-5
  at: 2026-10-19T22:20:00+02:00
---

# Zweck

Verwaltet Posts für die Kanäle Instagram, LinkedIn, X und Facebook und prüft **alle** Fachregeln
(siehe [Fachregeln](/rules/index.md)). Der UI-Service bereitet nur für die Anzeige auf und
prüft selbst nichts.

# Zugriff

| Umgebung | Basis-URL |
|---|---|
| lokal | `http://localhost:8081` |
| Konfiguration im UI-Service | `quarkus.rest-client.content-planner-backend.url` |
| Umgebungsvariable | `QUARKUS_REST_CLIENT_CONTENT_PLANNER_BACKEND_URL` |

- Endpunkte: [Posts](/api/posts.md), [Kanäle](/api/channels.md)
- Maßgeblicher Contract: `openapi/openapi.yaml` im Backend-Repo (wird beim Build erzeugt)
- Swagger UI lokal: `http://localhost:8081/q/swagger-ui`

# Grundsätze für Abnehmer

- Was erlaubt ist, steht in jeder [Post](/models/post.md)-Antwort (`editable`, `deletable`, `allowedTransitions`) – nicht nachbauen.
- Fehler kommen immer im [Fehlerformat](/models/error.md) mit stabilem `code` und werden unverändert angezeigt.
- Der Contract wird nur rückwärtskompatibel erweitert: neue optionale Felder ja, Umbenennen oder Entfernen nein.
