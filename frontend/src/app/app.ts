import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PostApiService, errorMessage } from './posts/post-api.service';
import { ChannelView, PostView } from './posts/post.model';
import { PostForm } from './posts/post-form';

interface StatusFilter {
  value: string;
  label: string;
}

@Component({
  selector: 'app-root',
  imports: [DatePipe, PostForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly api = inject(PostApiService);

  protected readonly filters: StatusFilter[] = [
    { value: '', label: 'Alle' },
    { value: 'DRAFT', label: 'Entwürfe' },
    { value: 'SCHEDULED', label: 'Eingeplant' },
    { value: 'PUBLISHED', label: 'Veröffentlicht' },
  ];

  protected readonly posts = signal<PostView[]>([]);
  protected readonly channels = signal<ChannelView[]>([]);
  protected readonly statusFilter = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  /** null = Formular geschlossen, 'new' = neuer Post, sonst der zu bearbeitende Post */
  protected readonly editing = signal<PostView | 'new' | null>(null);
  /** Vorlage für einen neuen Post („Für anderen Kanal übernehmen“), sonst null */
  protected readonly copySource = signal<PostView | null>(null);

  constructor() {
    this.api.listChannels().subscribe({
      next: (channels) => this.channels.set(channels),
      error: (err: unknown) => this.error.set(errorMessage(err)),
    });
    this.reload();
  }

  protected setFilter(value: string): void {
    this.statusFilter.set(value);
    this.reload();
  }

  protected reload(): void {
    this.loading.set(true);
    this.api.listPosts(this.statusFilter() || undefined).subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(errorMessage(err));
        this.loading.set(false);
      },
    });
  }

  protected openNew(): void {
    this.copySource.set(null);
    this.editing.set('new');
  }

  protected openCopy(post: PostView): void {
    this.copySource.set(post);
    this.editing.set('new');
  }

  protected openEdit(post: PostView): void {
    this.copySource.set(null);
    this.editing.set(post);
  }

  protected editedPost(): PostView | null {
    const editing = this.editing();
    return editing === 'new' ? null : editing;
  }

  protected onSaved(): void {
    this.editing.set(null);
    this.reload();
  }

  protected changeStatus(post: PostView, targetStatus: string): void {
    this.error.set(null);
    this.api.changeStatus(post.id, targetStatus).subscribe({
      next: () => this.reload(),
      error: (err: unknown) => this.error.set(errorMessage(err)),
    });
  }

  protected delete(post: PostView): void {
    if (!confirm(`„${post.title}“ wirklich löschen?`)) {
      return;
    }
    this.error.set(null);
    this.api.deletePost(post.id).subscribe({
      next: () => this.reload(),
      error: (err: unknown) => this.error.set(errorMessage(err)),
    });
  }
}
