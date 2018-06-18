import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { TimerTick } from './models/timerTick.model';
import { TimerTickStorageService } from './services/timer-tick-storage.service';
import { TimerTickService } from './services/timer-tick.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  totalTime: number;
  totalPercentage: number;
  talkIsRunning = false;
  private listOfObservables: Observable<TimerTick>[] = [];
  private startIndex = 0;

  constructor(
    public readonly timerTickService: TimerTickService,
    private readonly timerTickStorageService: TimerTickStorageService
  ) {}

  ngOnInit() {}

  intervalAdded(timerTick: TimerTick) {
    this.timerTickService.addTimerTick(timerTick);
    this.setTotalTimeAndPercentage();
    this.timerTickStorageService.save(timerTick);
  }

  deleteTimer(timerTick: TimerTick) {
    this.timerTickService.deleteTimerTick(timerTick);
    this.setTotalTimeAndPercentage();
    this.timerTickStorageService.delete(timerTick);
  }

  resetTimers() {
    this.timerTickService.resetTimerTicks();
    this.setTotalTimeAndPercentage();
  }

  start() {
    this.listOfObservables = this.timerTickService.listOfIntervals.map(item =>
      this.timerTickService.createInterval(item)
    );

    this.talkIsRunning = true;

    this.startTimer(this.startIndex);
  }

  private setTotalTimeAndPercentage() {
    this.totalTime = this.timerTickService.getTotalTime();
    this.totalPercentage = this.timerTickService.getTotalPercentage();
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
        this.totalPercentage = Math.round(
          this.timerTickService.getTotalPercentage()
        );

        if (currentTimerTick.secondsLeft === 0) {
          currentTimerTick.currentActive = false;
        }
      });
  }
}
