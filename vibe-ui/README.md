# Vibe-UI – eine eigene Oberfläche nur aus der Swagger-Doku

Diese Oberfläche ist **nicht Teil des Produkts**. Sie zeigt, was passiert, wenn sich jemand eine eigene
Oberfläche für den Content Planner baut („Vibe Coding“): Claude Code hat sie in einem leeren Ordner
erzeugt, ohne Zugriff auf den Code dieses Repos – nur mit der Swagger-Doku des laufenden UI-Service und
diesem einen Prompt:

> Die Swagger Doku ist unter http://localhost:8080/q/swagger-ui/ . Vibe Code mir eine GUI dazu in plain HTML, CSS, JS. In Herbstfarben.

Die Dateien sind unverändert so eingecheckt, wie der Agent sie erzeugt hat.

## Starten

Backend (8081) und UI-Service (8080) müssen laufen (siehe [README](../README.md)). Dann:

```bash
cd vibe-ui
node server.js        # http://localhost:3000
```

Andere API-Adresse: `API=http://localhost:8080 node server.js`.

## Warum `server.js`? (CORS)

Der UI-Service erlaubt keine Aufrufe von fremden Origins und antwortet einer Seite auf
`localhost:3000` mit `403 CORS Rejected – Invalid origin`. `server.js` (Node, ohne Abhängigkeiten)
liefert deshalb die Seite aus **und** leitet `/ui-api` an den UI-Service weiter. Für den Browser kommt
alles vom selben Origin – wie bei der Angular-App mit `proxy.conf.json`.

## Was die Oberfläche zeigt

Keine eigene Geschäftslogik: Status-Buttons kommen aus `actions`, Bearbeiten und Löschen nur bei
`editable`/`deletable`, Fehlermeldungen unverändert vom Backend. Weil alle Regeln im Backend liegen,
bleibt das System auch mit dieser fremden Oberfläche korrekt.

`.claude/launch.json` ist die Startkonfiguration, mit der der Agent die Seite in seiner Browser-Vorschau getestet hat.
