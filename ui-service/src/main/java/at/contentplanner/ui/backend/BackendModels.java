package at.contentplanner.ui.backend;

import java.time.Instant;
import java.util.List;

/**
 * Datenmodelle des Downstream-Services "content-planner-backend".
 * Spiegeln den OpenAPI-Contract unter docs/downstream/ wider.
 * Enum-Werte werden bewusst als String übernommen: Kennt das Backend einen neuen
 * Kanal oder Status, bricht der UI-Service dadurch nicht.
 */
public final class BackendModels {

    private BackendModels() {
    }

    public record Post(
            Long id,
            String title,
            String text,
            String channel,
            String status,
            Instant scheduledAt,
            Instant publishedAt,
            Instant createdAt,
            Instant updatedAt,
            boolean editable,
            boolean deletable,
            List<String> allowedTransitions) {
    }

    public record PostRequest(String title, String text, String channel, Instant scheduledAt) {
    }

    public record StatusChangeRequest(String targetStatus) {
    }

    public record Channel(String channel, String displayName, int maxLength) {
    }

    public record Error(int status, String code, String message) {
    }
}
