---
type: Business Rule
title: Status-Lebenszyklus
description: Erlaubte Statuswechsel eines Posts und was in welchem Status möglich ist.
resource: https://github.com/hegerald/content-planner-backend/blob/main/src/main/java/at/contentplanner/backend/post/PostRules.java
tags: [rule, status]
---

```
DRAFT ⇄ SCHEDULED → PUBLISHED
```

| Status | erlaubte Wechsel | ändern | löschen |
|---|---|---|---|
| `DRAFT` | → `SCHEDULED` | ja | ja |
| `SCHEDULED` | → `DRAFT`, → `PUBLISHED` | ja (Termin muss gültig bleiben) | ja |
| `PUBLISHED` | – (Endzustand) | nein | nein |

- Neue Posts sind immer `DRAFT`.
- Beim Wechsel nach `PUBLISHED` setzt das Backend `publishedAt`.
- Wechsel nach `SCHEDULED`: siehe [Veröffentlichungstermin](/rules/scheduling.md).
- Verletzungen: [INVALID_STATUS_TRANSITION](/errors/invalid-status-transition.md), [POST_NOT_EDITABLE](/errors/post-not-editable.md), [POST_NOT_DELETABLE](/errors/post-not-deletable.md).
- Abgebildet in den Feldern `allowedTransitions`, `editable`, `deletable` von [Post](/models/post.md).
