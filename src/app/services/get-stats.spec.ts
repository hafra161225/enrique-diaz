import { TestBed } from '@angular/core/testing';

import { GetStats } from './get-stats';

describe('GetStats', () => {
  let service: GetStats;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetStats);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
