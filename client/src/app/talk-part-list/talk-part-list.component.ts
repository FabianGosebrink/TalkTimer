import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimerTick } from '../models/timerTick.model';

@Component({
  selector: 'app-talk-part-list',
  templateUrl: './talk-part-list.component.html',
  styleUrls: ['./talk-part-list.component.css']
})
export class TalkPartListComponent implements OnInit {
  @Input() listOfIntervals: TimerTick[] = [];
  @Input() talkIsRunning: false;
  @Output() deleteTimer = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  deleteTimerTick(timerTick: TimerTick) {
    this.deleteTimer.emit(timerTick);
  }
}
