import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimerTick } from '../timerTick.model';
import { TimerTickResult } from '../timerTickResult.model';

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

  getTimerTickById(id: string) {
    return this.listOfIntervalsInternal.find(item => item.id === id);
  }

  activateTimerTick(currentActiveTimerTick: TimerTick) {
    this.setAllTimerTicksToInactive();

    if (!!currentActiveTimerTick) {
      this.listOfIntervalsInternal.map(item => {
        if (item.id === currentActiveTimerTick.id) {
          item.currentActive = true;
        }
      });
    }
  }

  setAllTimerTicksToInactive() {
    this.listOfIntervalsInternal.forEach(item => {
      item.currentActive = false;
    });
  }

  getCurrentActiveTimerTick() {
    return this.listOfIntervalsInternal
      .filter(item => !item.finished)
      .sort((obj1: TimerTick, obj2: TimerTick) => {
        return obj1.secondsLeft - obj2.secondsLeft;
      })[0];
  }

  createInterval(timerTick: TimerTick) {
    const toReturn = interval(1000).pipe(
      take(timerTick.seconds + 1),
      map(i => {
        const secondsLeft = timerTick.seconds - i;
        return new TimerTickResult(timerTick.id, secondsLeft);
      })
    );
    return toReturn;
  }
}
