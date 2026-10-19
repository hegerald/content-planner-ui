import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';

import { PostApiService, errorMessage } from './post-api.service';
import { ChannelView, PostInput, PostView } from './post.model';

interface PostFormModel {
  title: string;
  text: string;
  channel: string;
  /** Wert eines <input type="datetime-local"> (lokale Zeit) oder '' */
  scheduledAt: string;
}

const EMPTY: PostFormModel = { title: '', text: '', channel: '', scheduledAt: '' };

/**
 * Formular zum Anlegen und Bearbeiten.
 * Prüft nur Pflichtfelder für schnelles Feedback – ob der Post gültig ist
 * (Zeichenlimit, Termin, Status), entscheidet das Backend.
 */
@Component({
  selector: 'app-post-form',
  imports: [FormField],
  templateUrl: './post-form.html',
  styleUrl: './post-form.css',
})
export class PostForm {
  private readonly api = inject(PostApiService);

  readonly post = input<PostView | null>(null);
  readonly channels = input.required<ChannelView[]>();

  readonly saved = output<PostView>();
  readonly cancelled = output<void>();

  protected readonly model = signal<PostFormModel>({ ...EMPTY });
  protected readonly postForm = form(this.model, (path) => {
    required(path.title, { message: 'Titel ist ein Pflichtfeld' });
    required(path.text, { message: 'Text ist ein Pflichtfeld' });
    required(path.channel, { message: 'Bitte einen Kanal wählen' });
  });

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  /** Anzeige-Hilfe: Zeichenzähler. Die verbindliche Prüfung macht das Backend. */
  protected readonly maxLength = computed(
    () => this.channels().find((c) => c.channel === this.model().channel)?.maxLength ?? null,
  );
  protected readonly textLength = computed(() => this.model().text.length);
  protected readonly tooLong = computed(() => {
    const max = this.maxLength();
    return max !== null && this.textLength() > max;
  });
  protected readonly counterText = computed(() => {
    const max = this.maxLength();
    return max === null ? `${this.textLength()} Zeichen` : `${this.textLength()} / ${max} Zeichen`;
  });

  constructor() {
    effect(() => {
      const post = this.post();
      this.error.set(null);
      this.model.set(
        post
          ? {
              title: post.title,
              text: post.text,
              channel: post.channel,
              scheduledAt: toLocalInput(post.scheduledAt),
            }
          : { ...EMPTY },
      );
    });
  }

  protected submit(event: Event): void {
    event.preventDefault();
    if (this.postForm().invalid()) {
      return;
    }
    const value = this.model();
    const input: PostInput = {
      title: value.title,
      text: value.text,
      channel: value.channel,
      scheduledAt: value.scheduledAt ? new Date(value.scheduledAt).toISOString() : null,
    };
    const existing = this.post();
    const request = existing ? this.api.updatePost(existing.id, input) : this.api.createPost(input);

    this.saving.set(true);
    this.error.set(null);
    request.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.saved.emit(saved);
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.error.set(errorMessage(err));
      },
    });
  }
}

/** ISO-Zeitpunkt (UTC) → Wert für <input type="datetime-local"> in lokaler Zeit. */
function toLocalInput(iso: string | null): string {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}
