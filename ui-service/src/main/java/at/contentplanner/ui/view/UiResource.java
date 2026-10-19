package at.contentplanner.ui.view;

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
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import at.contentplanner.ui.backend.BackendClient;
import at.contentplanner.ui.backend.BackendModels;
import at.contentplanner.ui.view.ViewModels.ChannelView;
import at.contentplanner.ui.view.ViewModels.PostInput;
import at.contentplanner.ui.view.ViewModels.PostView;
import at.contentplanner.ui.view.ViewModels.StatusInput;

/**
 * Schnittstelle für Oberflächen (Angular-App, aber auch selbst gebaute UIs).
 * Reicht alle Änderungen an das Backend weiter; prüft selbst keine Regeln.
 */
@Path("/ui-api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "UI", description = "Anzeige-optimierte Endpunkte für Oberflächen")
public class UiResource {

    private final BackendClient backend;
    private final PostViewMapper mapper;

    public UiResource(@RestClient BackendClient backend, PostViewMapper mapper) {
        this.backend = backend;
        this.mapper = mapper;
    }

    @GET
    @Path("/posts")
    @Operation(operationId = "listPostViews", summary = "Posts für die Übersicht")
    public List<PostView> listPosts(@QueryParam("status") String status, @QueryParam("channel") String channel) {
        return mapper.toViews(backend.listPosts(status, channel), backend.listChannels());
    }

    @GET
    @Path("/posts/{id}")
    @Operation(operationId = "getPostView", summary = "Einzelnen Post für die Detailansicht")
    public PostView getPost(@PathParam("id") long id) {
        return mapper.toView(backend.getPost(id), backend.listChannels());
    }

    @POST
    @Path("/posts")
    @Operation(operationId = "createPostView", summary = "Post anlegen")
    public Response createPost(PostInput input) {
        PostView created = mapper.toView(backend.createPost(toRequest(input)), backend.listChannels());
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/posts/{id}")
    @Operation(operationId = "updatePostView", summary = "Post ändern")
    public PostView updatePost(@PathParam("id") long id, PostInput input) {
        return mapper.toView(backend.updatePost(id, toRequest(input)), backend.listChannels());
    }

    @POST
    @Path("/posts/{id}/status")
    @Operation(operationId = "changePostViewStatus", summary = "Status wechseln")
    public PostView changeStatus(@PathParam("id") long id, StatusInput input) {
        BackendModels.Post post = backend.changeStatus(id,
                new BackendModels.StatusChangeRequest(input == null ? null : input.targetStatus()));
        return mapper.toView(post, backend.listChannels());
    }

    @DELETE
    @Path("/posts/{id}")
    @Operation(operationId = "deletePostView", summary = "Post löschen")
    public void deletePost(@PathParam("id") long id) {
        backend.deletePost(id);
    }

    @GET
    @Path("/channels")
    @Operation(operationId = "listChannelViews", summary = "Kanäle für Auswahllisten")
    public List<ChannelView> listChannels() {
        return mapper.toChannelViews(backend.listChannels());
    }

    private static BackendModels.PostRequest toRequest(PostInput input) {
        if (input == null) {
            return new BackendModels.PostRequest(null, null, null, null);
        }
        return new BackendModels.PostRequest(input.title(), input.text(), input.channel(), input.scheduledAt());
    }
}
