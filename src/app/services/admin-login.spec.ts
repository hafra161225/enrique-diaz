import { TestBed } from '@angular/core/testing';

import { AdminLogin } from './admin-login';

describe('AdminLogin', () => {
  let service: AdminLogin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminLogin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
