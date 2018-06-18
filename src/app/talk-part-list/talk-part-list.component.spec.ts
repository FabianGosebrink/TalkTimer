import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalkPartListComponent } from './talk-part-list.component';

describe('TalkPartListComponent', () => {
  let component: TalkPartListComponent;
  let fixture: ComponentFixture<TalkPartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalkPartListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalkPartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
