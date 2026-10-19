package at.contentplanner.ui.common;

import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import io.quarkus.logging.Log;

public class ExceptionMappers {

    /** Fachlicher Fehler des Backends: Status, Code und Meldung 1:1 weitergeben. */
    @ServerExceptionMapper
    public Response downstream(DownstreamException e) {
        return error(e.status(), e.code(), e.getMessage());
    }

    /** Backend nicht erreichbar. */
    @ServerExceptionMapper
    public Response unreachable(ProcessingException e) {
        Log.warn("Backend nicht erreichbar", e);
        return error(503, "BACKEND_UNAVAILABLE", "Das Backend ist gerade nicht erreichbar.");
    }

    /** Sonstige HTTP-Fehler (auch unbekannte Backend-Antworten) im einheitlichen Format. */
    @ServerExceptionMapper
    public Response http(WebApplicationException e) {
        int status = e.getResponse() != null ? e.getResponse().getStatus() : 500;
        return error(status, "HTTP_" + status, e.getMessage());
    }

    private static Response error(int status, String code, String message) {
        return Response.status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(new ErrorView(status, code, message))
                .build();
    }
}
