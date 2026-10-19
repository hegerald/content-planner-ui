import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PostApiService, errorMessage } from './post-api.service';

describe('PostApiService', () => {
  let service: PostApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PostApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lädt Posts mit Status-Filter', () => {
    service.listPosts('DRAFT').subscribe((posts) => expect(posts).toEqual([]));

    const req = http.expectOne('/ui-api/posts?status=DRAFT');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('schickt Statuswechsel an den Status-Endpunkt', () => {
    service.changeStatus(7, 'SCHEDULED').subscribe();

    const req = http.expectOne('/ui-api/posts/7/status');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ targetStatus: 'SCHEDULED' });
    req.flush({});
  });
});

describe('errorMessage', () => {
  it('zeigt die Meldung des Backends an', () => {
    const error = new HttpErrorResponse({
      status: 422,
      error: { status: 422, code: 'TEXT_TOO_LONG', message: 'Der Text ist für X zu lang.' },
    });
    expect(errorMessage(error)).toBe('Der Text ist für X zu lang.');
  });

  it('meldet einen nicht erreichbaren UI-Service', () => {
    expect(errorMessage(new HttpErrorResponse({ status: 0 }))).toBe('Der UI-Service ist nicht erreichbar.');
  });
});
