import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { confirmSentCodeGuard } from './confirm-sent-code-guard';

describe('confirmSentCodeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => confirmSentCodeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
