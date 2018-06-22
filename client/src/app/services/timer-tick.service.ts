import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimerTick } from '../models/timerTick.model';

@Injectable({
  providedIn: 'root'
})
export class TimerTickService {
  listOfIntervals: TimerTick[] = [];

  addTimerTick(timerTick: TimerTick) {
    const index = this.listOfIntervals.length;
    this.listOfIntervals.splice(index, 0, timerTick);
  }

  deleteTimerTick(timerTickId: number) {
    this.listOfIntervals = this.listOfIntervals.filter(
      item => item.id !== timerTickId
    );
  }

  resetTimerTicks() {
    this.listOfIntervals = [];
  }

  getTotalTime() {
    let totalTime = 0;
    this.listOfIntervals.forEach(element => {
      totalTime += element.intervalSeconds;
    });

    return totalTime;
  }

  getTotalPercentage() {
    const totalTime = this.getTotalTime();

    if (totalTime === 0) {
      return 0;
    }

    const allSecondsLeft = this.getAllSecondsLeft();

    const percentage = (100 / totalTime) * allSecondsLeft;
    return percentage;
  }

  getAllIntervalls(): Observable<TimerTick>[] {
    return this.listOfIntervals.map(item => this.createInterval(item));
  }

  private createInterval(timerTick: TimerTick) {
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

  private getAllSecondsLeft() {
    let allSecondsLeft = 0;
    this.listOfIntervals.forEach(element => {
      allSecondsLeft += element.secondsLeft;
    });

    return allSecondsLeft;
  }
}
