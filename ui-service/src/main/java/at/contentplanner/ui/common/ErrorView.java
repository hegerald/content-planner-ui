package at.contentplanner.ui.common;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(name = "ErrorView", description = "Fehlerformat für das Frontend")
public record ErrorView(
        @Schema(description = "HTTP-Statuscode", examples = "422") int status,
        @Schema(description = "Stabiler Fehlercode (vom Backend übernommen)", examples = "TEXT_TOO_LONG") String code,
        @Schema(description = "Anzeigbare Meldung") String message) {
}
