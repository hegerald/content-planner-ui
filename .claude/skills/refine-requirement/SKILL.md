---
name: refine-requirement
description: Macht aus einer Kundenanforderung (z. B. E-Mail-Text) ein verfeinertes GitHub-Issue mit User Story, Akzeptanzkriterien und betroffenen Services. Nur manuell aufrufen, weil ein Issue angelegt wird.
argument-hint: "[Anforderungstext oder Pfad zur E-Mail]"
disable-model-invocation: true
---

# Anforderung verfeinern → GitHub-Issue

Eingabe: $ARGUMENTS
(Ist es ein Dateipfad, lies die Datei. Ist es leer, bitte um den Anforderungstext.)

## Ablauf

1. **Verstehen.** Lies die Anforderung und fasse in 2–3 Sätzen zusammen, was der Kunde
   eigentlich erreichen will (Ziel, nicht Lösung).
2. **Einordnen.** Prüfe gegen die Architektur, welche Teile betroffen sind:
   - Backend (`../content-planner-backend`, Regeln in `PostRules`) – lies dafür dessen `AGENTS.md`
   - UI-Service (`ui-service/`) und Frontend (`frontend/`) – siehe `AGENTS.md` hier
   - Contract: `docs/downstream/content-planner-backend.md`
   Faustregel: Jede neue Regel oder Berechnung gehört ins Backend.
3. **Lücken klären.** Stelle höchstens 3 gezielte Rückfragen, wenn etwas unklar ist, das die
   Umsetzung wesentlich ändert. Kleinere Annahmen nicht fragen, sondern im Issue unter
   „Annahmen" festhalten.
4. **Entwurf zeigen.** Zeige das Issue im Format unten und warte auf Freigabe.
5. **Anlegen.** Erst nach Freigabe das Issue über den GitHub-MCP (Server `github`) im Repo
   `hegerald/content-planner-ui` anlegen, Label `refined`. Gib Nummer und Link aus.

## Issue-Format

```markdown
## Ziel
<Warum will der Kunde das? 1–2 Sätze>

## User Story
Als <Rolle> möchte ich <Funktion>, damit <Nutzen>.

## Akzeptanzkriterien
- [ ] Given <Ausgangslage>, when <Aktion>, then <Ergebnis>
- [ ] … (inkl. mindestens ein Fehlerfall mit erwarteter Meldung)

## Betroffene Services
- Backend: <ja/nein – was>
- UI-Service: <ja/nein – was>
- Frontend: <ja/nein – was>
- API-Contract: <neue/geänderte Felder oder Endpunkte, rückwärtskompatibel?>

## Annahmen
- …

## Nicht Teil dieses Issues
- …
```

## Regeln
- Titel kurz und fachlich, ohne Lösungsdetails (z. B. „Posts duplizieren").
- Akzeptanzkriterien müssen testbar sein – daraus entstehen später die Tests.
- Keine Implementierungsdetails vorschreiben, außer der Kunde verlangt sie.
- Kundendaten (Namen, E-Mail-Adressen) nicht ins Issue übernehmen.
