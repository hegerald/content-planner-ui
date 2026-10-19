---
type: Error Code
title: NOT_FOUND
description: Der angefragte Post existiert nicht.
tags: [error, http-404]
http_status: 404
---

- **HTTP-Status:** 404
- **Wann:** Die ID in `/api/posts/{id}` ist unbekannt, z. B. weil der Post inzwischen gelöscht wurde.
- **Endpunkte:** [Posts](/api/posts.md)
- **Format:** [Fehlerantwort](/models/error.md)

# Examples

```json
{ "status": 404, "code": "NOT_FOUND", "message": "Post 999 existiert nicht." }
```

Abnehmer reagieren auf den Code `NOT_FOUND` – er wird nie umbenannt.
