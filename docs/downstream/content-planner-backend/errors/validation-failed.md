---
type: Error Code
title: VALIDATION_FAILED
description: Pflichtfeld fehlt oder Eingabe hat ein ungültiges Format.
tags: [error, http-400]
http_status: 400
---

- **HTTP-Status:** 400
- **Wann:** Titel, Text oder Kanal fehlt, Titel länger als 100 Zeichen oder unbekannter Wert.
- **Endpunkte:** [Posts](/api/posts.md)
- **Format:** [Fehlerantwort](/models/error.md)

# Examples

```json
{ "status": 400, "code": "VALIDATION_FAILED", "message": "title: must not be blank" }
```

Abnehmer reagieren auf den Code `VALIDATION_FAILED` – er wird nie umbenannt.
