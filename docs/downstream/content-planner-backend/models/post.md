---
type: Data Model
title: Post
description: Ein geplanter Social-Media-Post inklusive der vom Backend berechneten erlaubten Aktionen.
tags: [model, posts]
---

# Schema

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | number | ID |
| `title` | string | interner Titel, max. 100 Zeichen |
| `text` | string | Post-Text, Länge siehe [Zeichenlimit je Kanal](/rules/channel-limits.md) |
| `channel` | string | `INSTAGRAM`, `LINKEDIN`, `X`, `FACEBOOK` |
| `status` | string | `DRAFT`, `SCHEDULED`, `PUBLISHED` – siehe [Status-Lebenszyklus](/rules/status-lifecycle.md) |
| `scheduledAt` | string? | geplanter Zeitpunkt, ISO 8601 in UTC |
| `publishedAt` | string? | Veröffentlichungszeitpunkt, ISO 8601 in UTC |
| `createdAt`, `updatedAt` | string | ISO 8601 in UTC |
| `editable` | boolean | darf geändert werden – **vom Backend berechnet** |
| `deletable` | boolean | darf gelöscht werden – **vom Backend berechnet** |
| `allowedTransitions` | string[] | erlaubte Zielstatus – **vom Backend berechnet** |

Die drei berechneten Felder sind der Grund, warum keine Oberfläche Regeln nachbauen muss.
Der UI-Service macht daraus Buttons (`actions`).

Verwendet von: [Posts](/api/posts.md)
