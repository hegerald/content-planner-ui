---
type: Business Rule
title: Veröffentlichungstermin
description: Eingeplante Posts brauchen einen Veröffentlichungszeitpunkt in der Zukunft.
resource: https://github.com/hegerald/content-planner-backend/blob/main/src/main/java/at/contentplanner/backend/post/PostRules.java
tags: [rule, scheduling]
---

- Für Entwürfe (`DRAFT`) ist `scheduledAt` optional.
- Beim Wechsel nach `SCHEDULED` und beim Ändern eines eingeplanten Posts muss `scheduledAt` gesetzt sein und **nach** dem aktuellen Zeitpunkt liegen.
- Zeitpunkte immer ISO 8601 in UTC; das Backend vergleicht mit seiner eigenen Uhr.
- Verletzungen: [SCHEDULED_AT_REQUIRED](/errors/scheduled-at-required.md), [SCHEDULED_AT_IN_PAST](/errors/scheduled-at-in-past.md).
- Teil des [Status-Lebenszyklus](/rules/status-lifecycle.md).
