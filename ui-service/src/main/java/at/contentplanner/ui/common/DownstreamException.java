package at.contentplanner.ui.common;

/** Fehlerantwort des Downstream-Services (Backend), wird unverändert weitergegeben. */
public class DownstreamException extends RuntimeException {

    private final int status;
    private final String code;

    public DownstreamException(int status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public int status() {
        return status;
    }

    public String code() {
        return code;
    }
}
