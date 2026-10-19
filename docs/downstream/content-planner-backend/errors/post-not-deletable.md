---
type: Error Code
title: POST_NOT_DELETABLE
description: Ein veröffentlichter Post kann nicht gelöscht werden.
tags: [error, http-422]
http_status: 422
---

- **HTTP-Status:** 422
- **Wann:** `DELETE` auf einen Post mit Status `PUBLISHED` (`deletable` ist `false`).
- **Regel:** [Status-Lebenszyklus](/rules/status-lifecycle.md)
- **Endpunkte:** [Posts](/api/posts.md)
- **Format:** [Fehlerantwort](/models/error.md)

# Examples

```json
{ "status": 422, "code": "POST_NOT_DELETABLE", "message": "Ein veröffentlichter Post kann nicht gelöscht werden." }
```

Abnehmer reagieren auf den Code `POST_NOT_DELETABLE` – er wird nie umbenannt.
