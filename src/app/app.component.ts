import { Component, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { TimerTickService } from './services/timer-tick.service';
import { TimerTick } from './timerTick.model';
import { TimerTickResult } from './timerTickResult.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  totalTime: number;
  timerStarted = false;
  destroy$ = new Subject();

  constructor(private readonly timerTickService: TimerTickService) {}

  ngOnInit() {}

  intervalAdded(timerTick: TimerTick) {
    this.timerTickService.addTimerTick(timerTick);
    this.totalTime = this.timerTickService.getTotalTime();
  }

  deleteTimer(timerTick: TimerTick) {
    this.timerTickService.deleteTimerTick(timerTick);
    this.totalTime = this.timerTickService.getTotalTime();
  }

  resetTimers() {
    this.timerTickService.resetTimerTicks();
    this.totalTime = this.timerTickService.getTotalTime();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  start() {
    const listOfObservables = this.timerTickService.listOfIntervals.map(item =>
      this.timerTickService.createInterval(item)
    );

    merge(...listOfObservables)
      .pipe(
        tap(() => (this.timerStarted = true)),
        finalize(() => (this.timerStarted = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((result: TimerTickResult) => {
        const currentTimerTick = this.timerTickService.getTimerTickById(
          result.id
        );
        currentTimerTick.secondsLeft = result.secondsLeft;

        const currentActiveTimerTick = this.timerTickService.getCurrentActiveTimerTick();
        this.timerTickService.activateTimerTick(currentActiveTimerTick);
      });
  }
}
