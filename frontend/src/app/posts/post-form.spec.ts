import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PostForm } from './post-form';
import { ChannelView, PostView } from './post.model';

const CHANNELS: ChannelView[] = [
  { channel: 'INSTAGRAM', displayName: 'Instagram', maxLength: 2200 },
  { channel: 'X', displayName: 'X', maxLength: 280 },
];

function post(overrides: Partial<PostView> = {}): PostView {
  return {
    id: 1,
    title: 'Sommerfest',
    text: 'Fotos vom Fest',
    channel: 'INSTAGRAM',
    channelName: 'Instagram',
    status: 'PUBLISHED',
    statusLabel: 'Veröffentlicht',
    scheduledAt: '2026-07-01T09:00:00Z',
    publishedAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-07-01T09:00:00Z',
    editable: false,
    deletable: false,
    actions: [],
    ...overrides,
  };
}

describe('PostForm – Vorlage für anderen Kanal', () => {
  let fixture: ComponentFixture<PostForm>;
  let http: HttpTestingController;
  let el: HTMLElement;

  async function render(template: PostView): Promise<void> {
    fixture.componentRef.setInput('channels', CHANNELS);
    fixture.componentRef.setInput('template', template);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function selectChannel(channel: string): Promise<void> {
    const select = el.querySelector('select') as HTMLSelectElement;
    select.value = channel;
    select.dispatchEvent(new Event('input'));
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PostForm],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(PostForm);
    http = TestBed.inject(HttpTestingController);
    el = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => http.verify());

  it('befüllt Titel und Text aus der Vorlage, Kanal und Termin bleiben leer', async () => {
    await render(post());

    expect(el.querySelector('h2')?.textContent).toContain('Neuer Post');
    expect((el.querySelector('input[type="text"]') as HTMLInputElement).value).toBe('Sommerfest');
    expect((el.querySelector('textarea') as HTMLTextAreaElement).value).toBe('Fotos vom Fest');
    expect((el.querySelector('select') as HTMLSelectElement).value).toBe('');
    expect((el.querySelector('input[type="datetime-local"]') as HTMLInputElement).value).toBe('');
  });

  it('legt beim Speichern einen neuen Post im gewählten Kanal an, ohne das Original zu ändern', async () => {
    const saved = vi.fn();
    fixture.componentInstance.saved.subscribe(saved);
    await render(post());
    await selectChannel('X');

    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    const req = http.expectOne('/ui-api/posts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      title: 'Sommerfest',
      text: 'Fotos vom Fest',
      channel: 'X',
      scheduledAt: null,
    });
    req.flush(post({ id: 2, channel: 'X', status: 'DRAFT' }));
    expect(saved).toHaveBeenCalled();
  });

  it('zeigt die Überlänge für den gewählten Kanal sofort im Zeichenzähler', async () => {
    await render(post({ text: 'a'.repeat(300) }));
    await selectChannel('X');

    const counter = el.querySelector('.counter') as HTMLElement;
    expect(counter.textContent?.trim()).toBe('300 / 280 Zeichen');
    expect(counter.classList).toContain('over');
  });

  it('zeigt die Meldung des Backends bei TEXT_TOO_LONG und meldet keinen gespeicherten Post', async () => {
    const saved = vi.fn();
    fixture.componentInstance.saved.subscribe(saved);
    await render(post({ text: 'a'.repeat(300) }));
    await selectChannel('X');

    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    http.expectOne('/ui-api/posts').flush(
      { status: 422, code: 'TEXT_TOO_LONG', message: 'Der Text ist für X zu lang (300 von max. 280 Zeichen).' },
      { status: 422, statusText: 'Unprocessable Entity' },
    );
    fixture.detectChanges();

    expect(el.querySelector('.banner-error')?.textContent).toContain(
      'Der Text ist für X zu lang (300 von max. 280 Zeichen).',
    );
    expect(saved).not.toHaveBeenCalled();
  });

  it('legt beim Abbrechen keinen Post an', async () => {
    const cancelled = vi.fn();
    fixture.componentInstance.cancelled.subscribe(cancelled);
    await render(post());

    const cancel = [...el.querySelectorAll('button')].find((b) => b.textContent?.includes('Abbrechen'));
    cancel!.click();

    expect(cancelled).toHaveBeenCalled();
    http.expectNone('/ui-api/posts');
  });
});
