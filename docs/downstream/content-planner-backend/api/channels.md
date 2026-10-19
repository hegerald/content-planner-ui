---
type: REST Resource
title: Kanäle
description: Verfügbare Social-Media-Kanäle mit ihrem Zeichenlimit.
resource: http://localhost:8081/api/channels
tags: [api, channels]
---

# Operationen

| Methode | Pfad | Zweck | Erfolg |
|---|---|---|---|
| GET | `/api/channels` | Alle Kanäle mit Anzeigename und `maxLength` | 200 |

Die Limits selbst sind eine Fachregel: [Zeichenlimit je Kanal](/rules/channel-limits.md).

# Examples

```json
[ { "channel": "X", "displayName": "X", "maxLength": 280 }, … ]
```
