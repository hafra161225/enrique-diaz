import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkWithMePage } from './work-with-me.page';

describe('WorkWithMePage', () => {
  let component: WorkWithMePage;
  let fixture: ComponentFixture<WorkWithMePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkWithMePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
