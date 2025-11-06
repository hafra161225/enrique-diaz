import { TestBed } from '@angular/core/testing';

import { GetUpcomingAppointments } from './get-upcoming-appointments';

describe('GetUpcomingAppointments', () => {
  let service: GetUpcomingAppointments;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetUpcomingAppointments);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
