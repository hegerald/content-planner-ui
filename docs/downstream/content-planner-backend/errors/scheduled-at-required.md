---
type: Error Code
title: SCHEDULED_AT_REQUIRED
description: Ein eingeplanter Post hat keinen Veröffentlichungszeitpunkt.
tags: [error, http-422]
http_status: 422
---

- **HTTP-Status:** 422
- **Wann:** Wechsel nach `SCHEDULED` oder Ändern eines eingeplanten Posts ohne `scheduledAt`.
- **Regel:** [Veröffentlichungstermin](/rules/scheduling.md)
- **Endpunkte:** [Posts](/api/posts.md)
- **Format:** [Fehlerantwort](/models/error.md)

# Examples

```json
{ "status": 422, "code": "SCHEDULED_AT_REQUIRED", "message": "Für einen eingeplanten Post muss ein Veröffentlichungszeitpunkt gesetzt sein." }
```

Abnehmer reagieren auf den Code `SCHEDULED_AT_REQUIRED` – er wird nie umbenannt.
