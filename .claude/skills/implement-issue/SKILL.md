---
name: implement-issue
description: Setzt ein verfeinertes GitHub-Issue über Backend, UI-Service und Frontend um – Plan, Tests zuerst, Umsetzung, Review durch den reviewer-Subagent, Commit und Pull Request. Nur manuell aufrufen.
argument-hint: "[Issue-Nummer]"
disable-model-invocation: true
---

# Issue umsetzen

Issue: #$ARGUMENTS im Repo `hegerald/content-planner-ui`

## 1. Vorbereiten
- Issue über den GitHub-MCP lesen. Fehlen Akzeptanzkriterien, abbrechen und auf
  `/refine-requirement` verweisen.
- In jedem betroffenen Repo einen Branch anlegen: `feature/<nr>-<kurzer-slug>`
  (Backend liegt unter `../content-planner-backend`).
- Bei Backend-Änderungen zuerst `../content-planner-backend/AGENTS.md` lesen.

## 2. Plan
Zeige einen kurzen Plan und warte auf Freigabe:
- welche Dateien pro Service geändert werden,
- welche Tests neu dazukommen (je Akzeptanzkriterium mindestens einer),
- ob sich der API-Contract ändert (dann Skill `contract-change` befolgen).

## 3. Umsetzen – immer in dieser Reihenfolge
1. **Backend:** Test für die neue Regel schreiben (rot), Regel in `PostRules` umsetzen (grün),
   dann Service/Resource. `./mvnw package` im Backend → aktualisiert `openapi/openapi.yaml`.
2. **UI-Service:** Client-Modelle und Mapping erweitern, nur Darstellung. `./mvnw test`.
3. **Frontend:** Typen, Service, Komponenten. `npm test` und `npm run build`.

Nach jedem Schritt die Tests des jeweiligen Teils laufen lassen. Schlägt ein Test fehl, den
**Code** korrigieren – Tests nur ändern, wenn sich die Anforderung geändert hat, und das
dann ausdrücklich begründen.

## 4. Review
Starte den Subagent `reviewer` mit Issue-Nummer und den betroffenen Repos.
Behebe alle Befunde mit Schweregrad „hoch" und „mittel", danach erneut prüfen lassen
(höchstens 2 Runden; danach offene Punkte im PR auflisten).

## 5. Abschließen
- Commits pro Repo im Format `feat(#<nr>): <was>` (bzw. `fix`, `test`, `docs`), Text Deutsch.
- Push und Pull Request je Repo über den GitHub-MCP. PR-Beschreibung: `Closes #<nr>` (im UI-Repo),
  Zusammenfassung, Testnachweis, Review-Ergebnis. Backend-PR verweist auf das Issue per Link.
- Am Ende: Links zu den PRs und eine Zeile pro Akzeptanzkriterium, wodurch es abgedeckt ist.
