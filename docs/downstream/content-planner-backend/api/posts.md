---
type: REST Resource
title: Posts
description: Posts anlegen, ändern, löschen, auflisten und ihren Status wechseln.
resource: http://localhost:8081/api/posts
tags: [api, posts]
---

# Operationen

| Methode | Pfad | Zweck | Erfolg | Mögliche Fehler |
|---|---|---|---|---|
| GET | `/api/posts?status=&channel=` | Liste, sortiert nach geplantem Zeitpunkt (ohne Termin am Ende) | 200 | – |
| GET | `/api/posts/{id}` | Einzelner Post | 200 | [NOT_FOUND](/errors/not-found.md) |
| POST | `/api/posts` | Neuer Post, immer als `DRAFT` | 201 | [VALIDATION_FAILED](/errors/validation-failed.md), [TEXT_TOO_LONG](/errors/text-too-long.md) |
| PUT | `/api/posts/{id}` | Titel, Text, Kanal, Termin ändern | 200 | [VALIDATION_FAILED](/errors/validation-failed.md), [NOT_FOUND](/errors/not-found.md), [TEXT_TOO_LONG](/errors/text-too-long.md), [POST_NOT_EDITABLE](/errors/post-not-editable.md), [SCHEDULED_AT_REQUIRED](/errors/scheduled-at-required.md), [SCHEDULED_AT_IN_PAST](/errors/scheduled-at-in-past.md) |
| POST | `/api/posts/{id}/status` | Statuswechsel | 200 | [NOT_FOUND](/errors/not-found.md), [INVALID_STATUS_TRANSITION](/errors/invalid-status-transition.md), [SCHEDULED_AT_REQUIRED](/errors/scheduled-at-required.md), [SCHEDULED_AT_IN_PAST](/errors/scheduled-at-in-past.md) |
| DELETE | `/api/posts/{id}` | Löschen | 204 | [NOT_FOUND](/errors/not-found.md), [POST_NOT_DELETABLE](/errors/post-not-deletable.md) |

Antworten: [Post](/models/post.md) · Fehler: [Fehlerformat](/models/error.md)

# Examples

Anlegen:

```json
POST /api/posts
{ "title": "Herbst-Teaser", "text": "Bald ist es so weit …", "channel": "LINKEDIN",
  "scheduledAt": "2026-11-01T09:00:00Z" }
```

Status wechseln (Regeln siehe [Status-Lebenszyklus](/rules/status-lifecycle.md)):

```json
POST /api/posts/1/status
{ "targetStatus": "SCHEDULED" }
```
