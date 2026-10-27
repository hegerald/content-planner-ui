---
name: implement-issue
description: Setzt ein verfeinertes Issue mit Akzeptanzkriterien um – Branch, Plan mit Freigabe, Tests zuerst, Umsetzung über alle betroffenen Komponenten, unabhängiges Review mit dem Skill review-change, Commit und Pull Request. Verwenden, wenn ein Issue implementiert werden soll. Nur auf ausdrückliche Anweisung ausführen.
---

# Issue umsetzen

Issue: die Nummer aus dem Auftrag.

Dieser Skill ist projektunabhängig. Repos, Komponenten, Reihenfolge der Schichten, Befehle
und Konventionen stehen in der `AGENTS.md` des Projekts (und ggf. der verbundenen Repos).

## 1. Vorbereiten
- Issue über das Issue-System lesen. Fehlen testbare Akzeptanzkriterien: abbrechen und auf
  den Skill `refine-requirement` verweisen.
- `AGENTS.md` aller betroffenen Repos lesen.
- In jedem betroffenen Repo einen Branch `feature/<nr>-<kurzer-slug>` anlegen.

## 2. Plan – mit Freigabe
Kurz zeigen und auf Freigabe warten:
- geänderte Dateien je Komponente,
- neue Tests (je Akzeptanzkriterium mindestens einer),
- Änderungen an Schnittstellen/Contracts und ob sie rückwärtskompatibel sind.

## 3. Umsetzen
- Reihenfolge: von der Komponente mit der Business-Logik nach außen zur Oberfläche.
- Je Akzeptanzkriterium: Test schreiben (rot) → Code (grün) → aufräumen.
- Nach jeder Komponente deren Tests und Build laufen lassen (Befehle laut `AGENTS.md`).
- Schlägt ein Test fehl, den **Code** korrigieren. Tests nur ändern, wenn sich die
  Anforderung geändert hat – und das ausdrücklich begründen.
- Schnittstellen-Änderungen: Contract-Dateien mitziehen (siehe projektspezifische Skills).

## 4. Review – unabhängig
Skill `review-change` mit Issue-Nummer und betroffenen Repos in einem eigenen Kontext
ausführen (Subagent, falls das Werkzeug das kann, sonst eine neue Sitzung).
Befunde „hoch" und „mittel" beheben, danach erneut prüfen lassen.
**Maximal 2 Runden**; danach offene Punkte im Pull Request auflisten statt weiterzuschleifen.

## 5. Abschließen
- Commits: `feat(#<nr>): <was>` (bzw. `fix`, `test`, `docs`, `refactor`).
- Push und je Repo ein Pull Request nach Vorlage `.github/pull_request_template.md`;
  im Haupt-Repo `Closes #<nr>`.
- Zum Schluss: PR-Links und je Akzeptanzkriterium, wodurch es abgedeckt ist.
