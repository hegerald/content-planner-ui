---
type: Error Code
title: POST_NOT_EDITABLE
description: Ein veröffentlichter Post kann nicht mehr geändert werden.
tags: [error, http-422]
http_status: 422
---

- **HTTP-Status:** 422
- **Wann:** `PUT` auf einen Post mit Status `PUBLISHED` (`editable` ist `false`).
- **Regel:** [Status-Lebenszyklus](/rules/status-lifecycle.md)
- **Endpunkte:** [Posts](/api/posts.md)
- **Format:** [Fehlerantwort](/models/error.md)

# Examples

```json
{ "status": 422, "code": "POST_NOT_EDITABLE", "message": "Ein veröffentlichter Post kann nicht mehr geändert werden." }
```

Abnehmer reagieren auf den Code `POST_NOT_EDITABLE` – er wird nie umbenannt.
