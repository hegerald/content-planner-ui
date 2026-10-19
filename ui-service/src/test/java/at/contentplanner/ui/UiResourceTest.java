package at.contentplanner.ui;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import at.contentplanner.ui.backend.BackendClient;
import at.contentplanner.ui.backend.BackendModels;
import at.contentplanner.ui.common.DownstreamException;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;

/**
 * Testet den UI-Service isoliert: Das Backend wird gemockt.
 */
@QuarkusTest
class UiResourceTest {

    @InjectMock
    @RestClient
    BackendClient backend;

    private static final BackendModels.Post DRAFT = new BackendModels.Post(
            1L, "Teaser", "Hallo", "LINKEDIN", "DRAFT",
            null, null, Instant.parse("2026-10-20T10:00:00Z"), Instant.parse("2026-10-20T10:00:00Z"),
            true, true, List.of("SCHEDULED"));

    @BeforeEach
    void setUp() {
        when(backend.listChannels()).thenReturn(List.of(
                new BackendModels.Channel("LINKEDIN", "LinkedIn", 3000),
                new BackendModels.Channel("X", "X", 280)));
    }

    @Test
    void postsAreEnrichedWithLabelsAndActions() {
        when(backend.listPosts(null, null)).thenReturn(List.of(DRAFT));

        given().get("/ui-api/posts").then()
                .statusCode(200)
                .body("$", hasSize(1))
                .body("[0].channelName", equalTo("LinkedIn"))
                .body("[0].statusLabel", equalTo("Entwurf"))
                .body("[0].actions[0].targetStatus", equalTo("SCHEDULED"))
                .body("[0].actions[0].label", equalTo("Einplanen"));
    }

    @Test
    void businessErrorsOfBackendArePassedThrough() {
        when(backend.createPost(any())).thenThrow(
                new DownstreamException(422, "TEXT_TOO_LONG", "Der Text ist für X zu lang."));

        given().contentType(ContentType.JSON)
                .body(Map.of("title", "t", "text", "x".repeat(300), "channel", "X"))
                .post("/ui-api/posts")
                .then()
                .statusCode(422)
                .body("code", equalTo("TEXT_TOO_LONG"))
                .body("message", equalTo("Der Text ist für X zu lang."));
    }

    @Test
    void notFoundIsPassedThrough() {
        when(backend.getPost(anyLong())).thenThrow(new DownstreamException(404, "NOT_FOUND", "Post 9 existiert nicht."));

        given().get("/ui-api/posts/9").then()
                .statusCode(404)
                .body("code", equalTo("NOT_FOUND"));
    }
}
