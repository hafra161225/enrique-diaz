import { TestBed } from '@angular/core/testing';

import { GetAppointmentsToday } from './get-appointments-today';

describe('GetAppointmentsToday', () => {
  let service: GetAppointmentsToday;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAppointmentsToday);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
