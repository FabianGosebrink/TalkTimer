import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalksDetailsComponent } from './talks-details.component';

describe('TalksDetailsComponent', () => {
  let component: TalksDetailsComponent;
  let fixture: ComponentFixture<TalksDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalksDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalksDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
