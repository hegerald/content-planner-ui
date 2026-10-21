import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { App } from './app';
import { PostView } from './posts/post.model';

const PUBLISHED: PostView = {
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
};

describe('App – Post für anderen Kanal übernehmen', () => {
  let fixture: ComponentFixture<App>;
  let http: HttpTestingController;
  let el: HTMLElement;

  function button(text: string): HTMLButtonElement | undefined {
    return [...el.querySelectorAll('button')].find((b) => b.textContent?.includes(text));
  }

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(App);
    http = TestBed.inject(HttpTestingController);
    el = fixture.nativeElement as HTMLElement;

    http.expectOne('/ui-api/channels').flush([{ channel: 'X', displayName: 'X', maxLength: 280 }]);
    http.expectOne('/ui-api/posts').flush([PUBLISHED]);
    await settle();
  });

  afterEach(() => http.verify());

  it('bietet das Übernehmen auch für veröffentlichte Posts an und öffnet ein vorbefülltes Formular', async () => {
    button('Für anderen Kanal übernehmen')!.click();
    await settle();

    const form = el.querySelector('app-post-form') as HTMLElement;
    expect(form.querySelector('h2')?.textContent).toContain('Neuer Post');
    expect((form.querySelector('textarea') as HTMLTextAreaElement).value).toBe('Fotos vom Fest');
  });

  it('öffnet nach einer Übernahme mit „Neuer Post“ wieder ein leeres Formular', async () => {
    button('Für anderen Kanal übernehmen')!.click();
    await settle();
    button('Neuer Post')!.click();
    await settle();

    const form = el.querySelector('app-post-form') as HTMLElement;
    expect((form.querySelector('textarea') as HTMLTextAreaElement).value).toBe('');
  });

  it('öffnet nach einer Übernahme mit „Bearbeiten“ den Bearbeiten-Modus', async () => {
    fixture.componentInstance['reload']();
    http.expectOne('/ui-api/posts').flush([{ ...PUBLISHED, id: 2, status: 'DRAFT', editable: true }]);
    await settle();

    button('Für anderen Kanal übernehmen')!.click();
    await settle();
    button('Bearbeiten')!.click();
    await settle();

    const form = el.querySelector('app-post-form') as HTMLElement;
    expect(form.querySelector('h2')?.textContent).toContain('Post bearbeiten');
    expect((form.querySelector('input[type="text"]') as HTMLInputElement).value).toBe('Sommerfest');
  });
});
