---
type: Data Model
title: Fehlerantwort
description: Einheitliches Fehlerformat aller Endpunkte mit stabilem, maschinenlesbarem Code.
tags: [model, errors]
---

# Schema

| Feld | Typ | Beschreibung |
|---|---|---|
| `status` | number | HTTP-Statuscode (400, 404, 422) |
| `code` | string | stabiler Fehlercode – siehe [Fehlercodes](/errors/index.md) |
| `message` | string | lesbare Meldung auf Deutsch, zur direkten Anzeige |

Clients reagieren auf `code`, nie auf den Text von `message`.

# Examples

```json
{ "status": 422, "code": "TEXT_TOO_LONG", "message": "Der Text ist für X zu lang (300 von max. 280 Zeichen)." }
```
