# Eingabefehler

* [VALIDATION_FAILED](/errors/validation-failed.md) - Pflichtfeld fehlt oder Eingabe hat ein ungültiges Format (HTTP 400).
* [NOT_FOUND](/errors/not-found.md) - Der angefragte Post existiert nicht (HTTP 404).

# Fachliche Fehler (HTTP 422)

* [TEXT_TOO_LONG](/errors/text-too-long.md) - Der Text überschreitet das Zeichenlimit des Kanals.
* [SCHEDULED_AT_REQUIRED](/errors/scheduled-at-required.md) - Ein eingeplanter Post hat keinen Termin.
* [SCHEDULED_AT_IN_PAST](/errors/scheduled-at-in-past.md) - Der Termin liegt nicht in der Zukunft.
* [INVALID_STATUS_TRANSITION](/errors/invalid-status-transition.md) - Der gewünschte Statuswechsel ist nicht erlaubt.
* [POST_NOT_EDITABLE](/errors/post-not-editable.md) - Ein veröffentlichter Post kann nicht geändert werden.
* [POST_NOT_DELETABLE](/errors/post-not-deletable.md) - Ein veröffentlichter Post kann nicht gelöscht werden.
