---
type: Error Code
title: TEXT_TOO_LONG
description: Der Text überschreitet das Zeichenlimit des gewählten Kanals.
tags: [error, http-422]
http_status: 422
---

- **HTTP-Status:** 422
- **Wann:** Beim Anlegen oder Ändern ist der Text länger als das Limit des Kanals.
- **Regel:** [Zeichenlimit je Kanal](/rules/channel-limits.md)
- **Endpunkte:** [Posts](/api/posts.md)
- **Format:** [Fehlerantwort](/models/error.md)

# Examples

```json
{ "status": 422, "code": "TEXT_TOO_LONG", "message": "Der Text ist für X zu lang (300 von max. 280 Zeichen)." }
```

Abnehmer reagieren auf den Code `TEXT_TOO_LONG` – er wird nie umbenannt.
