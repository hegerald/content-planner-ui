package at.contentplanner.ui.backend;

import java.util.List;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import at.contentplanner.ui.backend.BackendModels.Channel;
import at.contentplanner.ui.backend.BackendModels.Error;
import at.contentplanner.ui.backend.BackendModels.Post;
import at.contentplanner.ui.backend.BackendModels.PostRequest;
import at.contentplanner.ui.backend.BackendModels.StatusChangeRequest;
import at.contentplanner.ui.common.DownstreamException;
import io.quarkus.rest.client.reactive.ClientExceptionMapper;
import io.smallrye.common.annotation.Blocking;

/**
 * REST-Client für den Downstream-Service "content-planner-backend".
 * Basis-URL: quarkus.rest-client.content-planner-backend.url
 */
@RegisterRestClient(configKey = "content-planner-backend")
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface BackendClient {

    @GET
    @Path("/posts")
    List<Post> listPosts(@QueryParam("status") String status, @QueryParam("channel") String channel);

    @GET
    @Path("/posts/{id}")
    Post getPost(@PathParam("id") long id);

    @POST
    @Path("/posts")
    Post createPost(PostRequest request);

    @PUT
    @Path("/posts/{id}")
    Post updatePost(@PathParam("id") long id, PostRequest request);

    @POST
    @Path("/posts/{id}/status")
    Post changeStatus(@PathParam("id") long id, StatusChangeRequest request);

    @DELETE
    @Path("/posts/{id}")
    void deletePost(@PathParam("id") long id);

    @GET
    @Path("/channels")
    List<Channel> listChannels();

    /**
     * Fehler des Backends (4xx/5xx) werden mit Code und Meldung durchgereicht,
     * damit das Frontend die fachliche Meldung des Backends anzeigen kann.
     */
    @ClientExceptionMapper
    @Blocking
    static RuntimeException toException(Response response) {
        try {
            Error error = response.readEntity(Error.class);
            if (error != null && error.code() != null) {
                return new DownstreamException(response.getStatus(), error.code(), error.message());
            }
        } catch (RuntimeException ignored) {
            // Body ist kein Error-JSON – unten generisch behandeln
        }
        return new WebApplicationException("Backend antwortete mit HTTP " + response.getStatus(),
                response.getStatus());
    }
}
