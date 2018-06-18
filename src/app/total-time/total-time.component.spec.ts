import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTimeComponent } from './total-time.component';

describe('TotalTimeComponent', () => {
  let component: TotalTimeComponent;
  let fixture: ComponentFixture<TotalTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
