import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookASessionPage } from './book-a-session.page';

describe('BookASessionPage', () => {
  let component: BookASessionPage;
  let fixture: ComponentFixture<BookASessionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BookASessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
