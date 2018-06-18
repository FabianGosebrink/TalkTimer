import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { TimerTick } from './models/timerTick.model';
import { TimerTickService } from './services/timer-tick.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private startIndex = 0;
  title = 'app';
  totalTime: number;
  talkIsRunning = false;
  private listOfObservables: Observable<TimerTick>[] = [];

  constructor(public readonly timerTickService: TimerTickService) {}

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
  }

  start() {
    this.listOfObservables = this.timerTickService.listOfIntervals.map(item =>
      this.timerTickService.createInterval(item)
    );

    this.talkIsRunning = true;

    this.startTimer(this.startIndex);
  }

  private startTimer(index: number) {
    if (!this.timerTickService.listOfIntervals[index]) {
      this.talkIsRunning = false;
      return;
    }

    const currentObservable = this.listOfObservables[index];

    currentObservable
      .pipe(
        tap((currentTimerTick: TimerTick) => {
          currentTimerTick.currentActive = true;
        }),
        finalize(() => {
          const newIndex = index + 1;
          this.startTimer(newIndex);
        })
      )
      .subscribe((currentTimerTick: TimerTick) => {
        if (currentTimerTick.secondsLeft === 0) {
          currentTimerTick.currentActive = false;
        }
      });
  }
}
