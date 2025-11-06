import { TestBed } from '@angular/core/testing';

import { SendNewsletter } from './send-newsletter';

describe('SendNewsletter', () => {
  let service: SendNewsletter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendNewsletter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
