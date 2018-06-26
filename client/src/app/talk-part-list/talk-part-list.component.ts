import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimerTick } from '../models/timerTick.model';
import { TimerTickUpdateModel } from '../models/timerTickUpdate.model';

@Component({
  selector: 'app-talk-part-list',
  templateUrl: './talk-part-list.component.html',
  styleUrls: ['./talk-part-list.component.css']
})
export class TalkPartListComponent implements OnInit {
  @Input() listOfIntervals: TimerTick[] = [];
  @Input() talkIsRunning: false;
  @Output() deleteTimer = new EventEmitter();
  @Output() updateTimer = new EventEmitter();
  @Output() indexChanged = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  deleteTimerTick(timerTick: TimerTick) {
    this.deleteTimer.emit(timerTick);
  }

  updateTimerTick(timerTick: TimerTick) {
    const toSend = new TimerTickUpdateModel(timerTick);
    this.updateTimer.emit(toSend);
  }

  moveUp(timerTick: TimerTick, currentIndex: number) {
    const newIndex = timerTick.index - 1;
    if (currentIndex === 0) {
      return;
    }
    timerTick.index = newIndex;
    this.indexChanged.emit(timerTick);
  }

  moveDown(timerTick: TimerTick, currentIndex: number) {
    const newIndex = timerTick.index + 1;
    if (currentIndex === this.listOfIntervals.length) {
      return;
    }

    timerTick.index = newIndex;
    this.indexChanged.emit(timerTick);
  }
}
