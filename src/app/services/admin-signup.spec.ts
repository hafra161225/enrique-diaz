import { TestBed } from '@angular/core/testing';

import { AdminSignup } from './admin-signup';

describe('AdminSignup', () => {
  let service: AdminSignup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSignup);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
