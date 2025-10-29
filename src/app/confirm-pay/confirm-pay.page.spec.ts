import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmPayPage } from './confirm-pay.page';

describe('ConfirmPayPage', () => {
  let component: ConfirmPayPage;
  let fixture: ComponentFixture<ConfirmPayPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
