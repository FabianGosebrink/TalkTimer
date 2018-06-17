import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, merge, Subject } from 'rxjs';
import { finalize, map, take, takeUntil, tap } from 'rxjs/operators';
import { TimerTick } from './timerTick.model';
import { TimerTickResult } from './timerTickResult.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  form: FormGroup;
  totalTime: number;
  timerStarted = false;
  destroy$ = new Subject();

  listOfIntervals: TimerTick[] = [];

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      timeInMinutes: new FormControl('', Validators.required),
      topic: new FormControl('', Validators.required)
    });
  }

  addTimer() {
    const completeTimeAlreadyAdded = this.getTotalTime();
    const enteredValueInSeconds = +this.form.value.timeInMinutes * 60;
    const secondsToAdd = completeTimeAlreadyAdded + enteredValueInSeconds;

    const topic = this.form.value.topic || '';
    const timerTick = new TimerTick(
      topic,
      secondsToAdd * 1000,
      enteredValueInSeconds
    );
    this.listOfIntervals.push(timerTick);
    this.totalTime = this.getTotalTime();
    this.form.reset();
  }

  deleteTimer(timerTick: TimerTick) {
    this.listOfIntervals = this.listOfIntervals.filter(
      item => item.id !== timerTick.id
    );
    this.totalTime = this.getTotalTime();
  }

  resetTimers() {
    this.listOfIntervals = [];
    this.form.reset();
    this.totalTime = this.getTotalTime();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  start() {
    const listOfObservables = this.listOfIntervals.map(item =>
      this.createInterval(item)
    );

    merge(...listOfObservables)
      .pipe(
        tap(() => (this.timerStarted = true)),
        finalize(() => (this.timerStarted = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((result: TimerTickResult) => {
        const currentTimerTick = this.getTimerTickById(result.id);
        currentTimerTick.secondsLeft = result.secondsLeft;

        const currentActiveTimerTick = this.getCurrentActiveTimerTick();
        this.activateTimerTick(currentActiveTimerTick);
      });
  }

  private getTimerTickById(id: string) {
    return this.listOfIntervals.find(item => item.id === id);
  }

  private activateTimerTick(currentActiveTimerTick: TimerTick) {
    this.setAllTimerTicksToInactive();

    if (!!currentActiveTimerTick) {
      this.listOfIntervals.map(item => {
        if (item.id === currentActiveTimerTick.id) {
          item.currentActive = true;
        }
      });
    }
  }

  private setAllTimerTicksToInactive() {
    this.listOfIntervals.forEach(item => {
      item.currentActive = false;
    });
  }

  private getCurrentActiveTimerTick() {
    return this.listOfIntervals
      .filter(item => !item.finished)
      .sort((obj1: TimerTick, obj2: TimerTick) => {
        return obj1.secondsLeft - obj2.secondsLeft;
      })[0];
  }

  private createInterval(timerTick: TimerTick) {
    const toReturn = interval(1000).pipe(
      take(timerTick.seconds + 1),
      map(i => {
        const secondsLeft = timerTick.seconds - i;
        return new TimerTickResult(timerTick.id, secondsLeft);
      })
    );
    return toReturn;
  }

  private getTotalTime() {
    let totalTime = 0;
    this.listOfIntervals.forEach(element => {
      totalTime += element.intervalSeconds;
    });

    return totalTime;
  }
}
