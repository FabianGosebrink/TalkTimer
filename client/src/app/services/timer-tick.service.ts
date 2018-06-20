import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimerTick } from '../models/timerTick.model';
import { TalkStorageService } from './talk-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TimerTickService {
  private listOfIntervalsInternal: TimerTick[] = [];

  get listOfIntervals() {
    return this.listOfIntervalsInternal;
  }

  constructor(private readonly talkStorageService: TalkStorageService) {
    // this.listOfIntervalsInternal = talkStorageService.getAll();
  }

  addTimerTick(timerTick: TimerTick) {
    this.listOfIntervalsInternal = [
      ...this.listOfIntervalsInternal,
      ...[timerTick]
    ];
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

  getTotalPercentage() {
    const totalTime = this.getTotalTime();

    if (totalTime === 0) {
      return 0;
    }

    const allSecondsLeft = this.getAllSecondsLeft();

    const percentage = (100 / totalTime) * allSecondsLeft;
    return percentage;
  }

  getAllIntervalls() {
    return this.listOfIntervalsInternal.map(item => this.createInterval(item));
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
    this.listOfIntervalsInternal.forEach(element => {
      allSecondsLeft += element.secondsLeft;
    });

    return allSecondsLeft;
  }
}
