import { TestBed } from '@angular/core/testing';

import { MakePayment } from './make-payment';

describe('MakePayment', () => {
  let service: MakePayment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakePayment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
