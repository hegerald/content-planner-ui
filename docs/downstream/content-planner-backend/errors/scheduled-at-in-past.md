---
type: Error Code
title: SCHEDULED_AT_IN_PAST
description: Der Veröffentlichungszeitpunkt liegt nicht in der Zukunft.
tags: [error, http-422]
http_status: 422
---

- **HTTP-Status:** 422
- **Wann:** Wechsel nach `SCHEDULED` oder Ändern eines eingeplanten Posts mit einem Termin, der nicht nach jetzt liegt.
- **Regel:** [Veröffentlichungstermin](/rules/scheduling.md)
- **Endpunkte:** [Posts](/api/posts.md)
- **Format:** [Fehlerantwort](/models/error.md)

# Examples

```json
{ "status": 422, "code": "SCHEDULED_AT_IN_PAST", "message": "Der Veröffentlichungszeitpunkt muss in der Zukunft liegen." }
```

Abnehmer reagieren auf den Code `SCHEDULED_AT_IN_PAST` – er wird nie umbenannt.
