---
name: verify-all
description: Führt alle Builds und Tests des Content Planners lokal so aus wie die CI – Backend (Nachbar-Repo), UI-Service, Frontend und Wissens-Bundle (OKF), inklusive Contract-Prüfung – über `scripts/verify.mjs` und wertet das Ergebnis pro Teil aus. Verwenden vor Commit, Push oder Pull Request und immer, wenn gefragt wird, ob alles grün ist. Optional nur einzelne Teile, z. B. nur `frontend`.
---

# Alles prüfen (wie CI)

Die Prüfung selbst steckt in `scripts/verify.mjs`; die CI-Jobs und der Git-Hook `pre-push` rufen dasselbe
Skript auf (das Backend über `../content-planner-backend/scripts/verify.mjs`). Dieser Skill führt
es aus und wertet aus. Starten der App statt Prüfen: Skill `start-services`.

## Schritte

1. Im Repo-Root: `node scripts/verify.mjs <Teile> --quiet` (ohne Teile = alles).
   Die Teile laufen parallel, alles zusammen ca. 1,5–2 min. Laufende Dev-Server stören nicht
   (Test-Ports 8090/8091). Das Skript gibt eine Tabelle pro Teil aus, darunter Fehlerauszüge und
   den Ordner mit den Logs.
2. **Auswerten** – bei Exit-Code ≠ 0 oder `nicht geprüft`:
   - **Tests rot:** Auszug unter der Tabelle nennt Test und Meldung; reicht er nicht, das Log des
     Teils lesen. Ursache suchen, Tests nicht ohne Nachfrage anpassen.
   - **Contract geändert:** API von Backend oder UI-Service hat sich geändert. Diff von
     `openapi/` zeigen; gewollt → Skill `contract-change` befolgen und die Dateien mit committen.
   - **Frontend: „node_modules veraltet, aber `npm start` läuft“:** `npm ci` würde dem
     Dev-Server die Dateien wegziehen. Nutzer fragen, ob der Dev-Server gestoppt werden darf.
   - **OKF: „Python 3 fehlt“:** Unter Windows sind `python3`/`python` oft nur der
     Microsoft-Store-Platzhalter. Nicht selbst installieren, Teil als nicht geprüft melden – die
     CI prüft ihn trotzdem.
   - **Backend: „Nachbar-Repo fehlt“:** `../content-planner-backend` ist nicht ausgecheckt.
3. **Melden:** die Tabelle, darunter nur Fehlschläge mit Ursache und Auffälligkeiten.
   Nichts automatisch reparieren oder committen.

## Hinweise
- Unter Windows (`core.autocrlf=true`) zeigt `git status` nach dem Maven-Build
  `M …/openapi/openapi.yaml`. Meldet das Skript `Contract aktuell`, ist das nur der
  Zeilenumbruch – nicht committen. `git checkout -- <pfad>/openapi/` räumt die Anzeige auf (nur
  wenn `git diff` dafür leer ist).
- Ändert sich, was geprüft wird, das Skript anpassen – nicht diesen Skill oder die CI.
