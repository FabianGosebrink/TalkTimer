import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimerTick } from '../models/timerTick.model';

@Injectable({
  providedIn: 'root'
})
export class TimerTickService {
  private listOfIntervalsInternal: TimerTick[] = [];

  get listOfIntervals() {
    return this.listOfIntervalsInternal;
  }

  constructor() {}

  addTimerTick(timerTick: TimerTick) {
    this.listOfIntervalsInternal.push(timerTick);
  }

  deleteTimerTick(timerTick: TimerTick) {
    this.listOfIntervalsInternal = this.listOfIntervals.filter(
      item => item.id !== timerTick.id
    );
  }

  resetTimerTicks() {
    this.listOfIntervalsInternal = [];
  }

  getTotalTime() {
    let totalTime = 0;
    this.listOfIntervalsInternal.forEach(element => {
      totalTime += element.intervalSeconds;
    });

    return totalTime;
  }

  createInterval(timerTick: TimerTick) {
    const toReturn = interval(1000).pipe(
      take(timerTick.intervalSeconds + 1),
      map(i => {
        const secondsLeft = timerTick.intervalSeconds - i;
        timerTick.secondsLeft = secondsLeft;
        return timerTick;
      })
    );
    return toReturn;
  }
}
