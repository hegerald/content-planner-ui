---
name: contract-change
description: Checkliste, wenn sich die REST-API des Content-Planner-Backends ändert (neues Feld, neuer Endpunkt, neuer Fehlercode) und die Änderung bis ins Frontend durchgezogen werden muss. Verwenden, sobald openapi.yaml, BackendModels oder die UI-API angepasst werden.
metadata:
  scope: project
  version: "1.0"
---

# API-Änderung durch alle Schichten ziehen

Reihenfolge einhalten, sonst laufen Contract und Code auseinander.

1. **Backend** (`../content-planner-backend`)
   - DTO/Resource ändern, `@Schema`-Beschreibung auf Deutsch ergänzen.
   - Nur rückwärtskompatibel: neue Felder optional, nichts umbenennen oder entfernen.
   - Neuer Fehlerfall → neuer, stabiler `code` in einer `BusinessRuleException`.
   - `./mvnw package` → `openapi/openapi.yaml` hat sich geändert und wird mit committet.
2. **Contract-Kurzfassung** `docs/downstream/content-planner-backend.md` anpassen
   (Endpunkt-Tabelle, Datenmodell, Fehlercodes).
3. **UI-Service**
   - `backend/BackendModels.java` und `backend/BackendClient.java` an den Contract anpassen.
   - `view/ViewModels.java` + `view/PostViewMapper.java`: nur Anzeige (Labels, Buttons).
   - Neue Aktion des Backends → neues Label in `ACTION_LABELS`.
   - `./mvnw package` → `ui-service/openapi/` aktualisiert.
4. **Frontend**
   - `posts/post.model.ts` an `ui-service/openapi/openapi.yaml` anpassen.
   - Anzeige nur aus Feldern der UI-API ableiten, keine Regeln nachbauen.

Prüfen: Kommt jedes neue Backend-Feld, das die Oberfläche braucht, in allen drei Schichten an?
