package at.contentplanner.ui.view;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;

import at.contentplanner.ui.backend.BackendModels;
import at.contentplanner.ui.view.ViewModels.ActionView;
import at.contentplanner.ui.view.ViewModels.ChannelView;
import at.contentplanner.ui.view.ViewModels.PostView;

/**
 * Übersetzt Backend-Daten in Anzeige-Modelle (reine Darstellung, keine Regeln).
 */
@ApplicationScoped
public class PostViewMapper {

    private static final Map<String, String> STATUS_LABELS = Map.of(
            "DRAFT", "Entwurf",
            "SCHEDULED", "Eingeplant",
            "PUBLISHED", "Veröffentlicht");

    private static final Map<String, String> ACTION_LABELS = Map.of(
            "DRAFT", "Zurück zu Entwurf",
            "SCHEDULED", "Einplanen",
            "PUBLISHED", "Als veröffentlicht markieren");

    public List<PostView> toViews(List<BackendModels.Post> posts, List<BackendModels.Channel> channels) {
        Map<String, String> channelNames = channels.stream()
                .collect(Collectors.toMap(BackendModels.Channel::channel, BackendModels.Channel::displayName));
        return posts.stream().map(p -> toView(p, channelNames)).toList();
    }

    public PostView toView(BackendModels.Post post, List<BackendModels.Channel> channels) {
        return toView(post, channels.stream()
                .collect(Collectors.toMap(BackendModels.Channel::channel, BackendModels.Channel::displayName)));
    }

    public List<ChannelView> toChannelViews(List<BackendModels.Channel> channels) {
        return channels.stream()
                .map(c -> new ChannelView(c.channel(), c.displayName(), c.maxLength()))
                .toList();
    }

    private PostView toView(BackendModels.Post post, Map<String, String> channelNames) {
        List<ActionView> actions = post.allowedTransitions() == null ? List.of()
                : post.allowedTransitions().stream()
                        .map(target -> new ActionView(target, label(ACTION_LABELS, target)))
                        .toList();
        return new PostView(
                post.id(),
                post.title(),
                post.text(),
                post.channel(),
                channelNames.getOrDefault(post.channel(), post.channel()),
                post.status(),
                label(STATUS_LABELS, post.status()),
                post.scheduledAt(),
                post.publishedAt(),
                post.updatedAt(),
                post.editable(),
                post.deletable(),
                actions);
    }

    private static String label(Map<String, String> labels, String key) {
        return labels.getOrDefault(key, key);
    }
}
