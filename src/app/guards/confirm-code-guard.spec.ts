import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { confirmCodeGuard } from './confirm-code-guard';

describe('confirmCodeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => confirmCodeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
