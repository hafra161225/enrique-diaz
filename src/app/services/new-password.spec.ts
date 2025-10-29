import { TestBed } from '@angular/core/testing';

import { NewPassword } from './new-password';

describe('NewPassword', () => {
  let service: NewPassword;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewPassword);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
