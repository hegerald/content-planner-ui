---
name: implement-issue
description: Setzt ein verfeinertes Issue mit Akzeptanzkriterien um – Branch, Plan mit Freigabe, Tests zuerst, Umsetzung über alle betroffenen Komponenten, unabhängiges Review durch den Custom Agent reviewer, Commit und Pull Request. Verwenden, wenn ein Issue implementiert werden soll. Nur manuell aufrufen.
argument-hint: "[Issue-Nummer]"
disable-model-invocation: true
---

# Issue umsetzen

Issue: die Nummer, die beim Aufruf mitgegeben wurde.

Dieser Skill ist projektunabhängig. Repos, Komponenten, Reihenfolge der Schichten, Befehle
und Konventionen stehen in den Copilot-Anweisungen des Projekts (`.github/copilot-instructions.md`) (und ggf. der verbundenen Repos).

## 1. Vorbereiten
- Issue über das Issue-System lesen. Fehlen testbare Akzeptanzkriterien: abbrechen und auf
  den Skill `refine-requirement` verweisen.
- `.github/copilot-instructions.md` aller betroffenen Repos lesen.
- In jedem betroffenen Repo einen Branch `feature/<nr>-<kurzer-slug>` anlegen.

## 2. Plan – mit Freigabe
Kurz zeigen und auf Freigabe warten:
- geänderte Dateien je Komponente,
- neue Tests (je Akzeptanzkriterium mindestens einer),
- Änderungen an Schnittstellen/Contracts und ob sie rückwärtskompatibel sind.

## 3. Umsetzen
- Reihenfolge: von der Komponente mit der Business-Logik nach außen zur Oberfläche.
- Je Akzeptanzkriterium: Test schreiben (rot) → Code (grün) → aufräumen.
- Nach jeder Komponente deren Tests und Build laufen lassen (Befehle laut Copilot-Anweisungen).
- Schlägt ein Test fehl, den **Code** korrigieren. Tests nur ändern, wenn sich die
  Anforderung geändert hat – und das ausdrücklich begründen.
- Schnittstellen-Änderungen: Contract-Dateien mitziehen (siehe projektspezifische Skills).

## 4. Review – unabhängig
Custom Agent `reviewer` (`.github/agents/reviewer.agent.md`) als Subagent mit Issue-Nummer
und betroffenen Repos starten.
Befunde „hoch" und „mittel" beheben, danach erneut prüfen lassen.
**Maximal 2 Runden**; danach offene Punkte im Pull Request auflisten statt weiterzuschleifen.

## 5. Abschließen
- Commits: `feat(#<nr>): <was>` (bzw. `fix`, `test`, `docs`, `refactor`).
- Push und je Repo ein Pull Request nach Vorlage `.github/pull_request_template.md`;
  im Haupt-Repo `Closes #<nr>`.
- Zum Schluss: PR-Links und je Akzeptanzkriterium, wodurch es abgedeckt ist.
