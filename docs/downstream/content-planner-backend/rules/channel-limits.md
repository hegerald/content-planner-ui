---
type: Business Rule
title: Zeichenlimit je Kanal
description: Der Post-Text darf das Zeichenlimit des gewählten Kanals nicht überschreiten.
resource: https://github.com/hegerald/content-planner-backend/blob/main/src/main/java/at/contentplanner/backend/channel/Channel.java
tags: [rule, channels]
---

| Kanal | max. Zeichen |
|---|---|
| `INSTAGRAM` | 2.200 |
| `LINKEDIN` | 3.000 |
| `X` | 280 |
| `FACEBOOK` | 63.206 |

- Geprüft beim Anlegen und Ändern.
- Verletzung: [TEXT_TOO_LONG](/errors/text-too-long.md).
- Die aktuellen Werte liefert [Kanäle](/api/channels.md) – Oberflächen dürfen sie für einen Zeichenzähler nutzen, die verbindliche Prüfung bleibt im Backend.
