---
name: refine-requirement
description: Macht aus einer formlosen Anforderung (Kunden-E-Mail, Notiz, Gesprächsprotokoll) ein verfeinertes Issue mit Ziel, User Story, testbaren Akzeptanzkriterien und betroffenen Komponenten. Verwenden, wenn eine neue Anforderung ins Backlog soll. Legt ein Issue an, daher nur manuell aufrufen.
argument-hint: "[Anforderungstext oder Pfad zur Datei]"
disable-model-invocation: true
---

# Anforderung verfeinern → Issue

Eingabe: der Text oder Dateipfad, der beim Aufruf mitgegeben wurde.
Ist es ein Dateipfad, lies die Datei. Ist es leer, bitte um den Anforderungstext.

Dieser Skill ist projektunabhängig. Alles Projektspezifische (Architektur, Repos,
Komponenten, Labels) steht in den Copilot-Anweisungen des Projekts (`.github/copilot-instructions.md`) – lies sie zuerst.

## Ablauf

1. **Verstehen.** Fasse in 2–3 Sätzen zusammen, was die Person erreichen will
   (Ziel, nicht Lösung).
2. **Einordnen.** Bestimme anhand der Copilot-Anweisungen, welche Komponenten betroffen sind.
   Faustregel: Neue Regeln und Berechnungen gehören dorthin, wo laut Architektur die
   Business-Logik liegt.
3. **Lücken klären.** Höchstens 3 gezielte Rückfragen, und nur wenn die Antwort die
   Umsetzung wesentlich ändert. Kleinere Annahmen nicht fragen, sondern unter
   „Annahmen" festhalten.
4. **Entwurf zeigen.** Issue im Format von [references/issue-format.md](references/issue-format.md)
   ausgeben und auf Freigabe warten.
5. **Anlegen.** Erst nach Freigabe über das angebundene Issue-System (z. B. GitHub-MCP)
   anlegen. Repo und Labels laut Copilot-Anweisungen. Nummer und Link ausgeben.

## Regeln
- Titel kurz und fachlich, ohne Lösungsdetails.
- Jedes Akzeptanzkriterium muss testbar sein – daraus entstehen später die Tests.
- Mindestens ein Fehlerfall mit erwarteter Meldung.
- Keine Implementierung vorschreiben, außer die Anforderung verlangt sie.
- Personenbezogene Daten (Namen, E-Mail-Adressen, Firmen) nicht ins Issue übernehmen.
