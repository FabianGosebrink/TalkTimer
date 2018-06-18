import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalksOverviewComponent } from './talks-overview.component';

describe('TalksOverviewComponent', () => {
  let component: TalksOverviewComponent;
  let fixture: ComponentFixture<TalksOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalksOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
