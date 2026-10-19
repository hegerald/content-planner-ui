---
type: Error Code
title: INVALID_STATUS_TRANSITION
description: Der gewünschte Statuswechsel ist nicht erlaubt.
tags: [error, http-422]
http_status: 422
---

- **HTTP-Status:** 422
- **Wann:** Ziel ist nicht in `allowedTransitions`, z. B. `DRAFT` direkt nach `PUBLISHED`.
- **Regel:** [Status-Lebenszyklus](/rules/status-lifecycle.md)
- **Endpunkte:** [Posts](/api/posts.md)
- **Format:** [Fehlerantwort](/models/error.md)

# Examples

```json
{ "status": 422, "code": "INVALID_STATUS_TRANSITION", "message": "Statuswechsel von DRAFT nach PUBLISHED ist nicht erlaubt." }
```

Abnehmer reagieren auf den Code `INVALID_STATUS_TRANSITION` – er wird nie umbenannt.
