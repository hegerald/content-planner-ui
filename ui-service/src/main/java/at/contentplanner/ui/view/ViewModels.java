package at.contentplanner.ui.view;

import java.time.Instant;
import java.util.List;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

/**
 * Anzeige-Modelle für das Frontend.
 * Enthalten nur Darstellungs-Informationen (Labels, Aktionen) – keine Business-Regeln.
 * Ob eine Aktion erlaubt ist, entscheidet ausschließlich das Backend.
 */
public final class ViewModels {

    private ViewModels() {
    }

    @Schema(name = "PostView", description = "Ein Post, aufbereitet für die Anzeige")
    public record PostView(
            Long id,
            String title,
            String text,
            @Schema(description = "Kanal-Schlüssel", examples = "LINKEDIN") String channel,
            @Schema(description = "Kanal-Anzeigename", examples = "LinkedIn") String channelName,
            @Schema(description = "Status-Schlüssel", examples = "DRAFT") String status,
            @Schema(description = "Status-Anzeigename", examples = "Entwurf") String statusLabel,
            Instant scheduledAt,
            Instant publishedAt,
            Instant updatedAt,
            boolean editable,
            boolean deletable,
            @Schema(description = "Buttons, die für diesen Post angezeigt werden sollen") List<ActionView> actions) {
    }

    @Schema(name = "ActionView", description = "Eine vom Backend erlaubte Statusänderung als Button")
    public record ActionView(
            @Schema(examples = "SCHEDULED") String targetStatus,
            @Schema(examples = "Einplanen") String label) {
    }

    @Schema(name = "ChannelView", description = "Kanal für Auswahllisten")
    public record ChannelView(String channel, String displayName, int maxLength) {
    }

    @Schema(name = "PostInput", description = "Formulardaten zum Anlegen oder Ändern eines Posts")
    public record PostInput(
            String title,
            String text,
            @Schema(examples = "LINKEDIN") String channel,
            @Schema(description = "ISO-8601, UTC; optional", examples = "2026-11-01T09:00:00Z") Instant scheduledAt) {
    }

    @Schema(name = "StatusInput", description = "Gewünschter Zielstatus")
    public record StatusInput(@Schema(examples = "SCHEDULED") String targetStatus) {
    }
}
