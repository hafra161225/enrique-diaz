import { TestBed } from '@angular/core/testing';

import { FinalizePayment } from './finalize-payment';

describe('FinalizePayment', () => {
  let service: FinalizePayment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinalizePayment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
