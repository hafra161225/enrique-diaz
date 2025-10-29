import { TestBed } from '@angular/core/testing';

import { ConfirmCode } from './confirm-code';

describe('ConfirmCode', () => {
  let service: ConfirmCode;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmCode);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
