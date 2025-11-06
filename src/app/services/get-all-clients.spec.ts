import { TestBed } from '@angular/core/testing';

import { GetAllClients } from './get-all-clients';

describe('GetAllClients', () => {
  let service: GetAllClients;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllClients);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
