import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { interval, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimerTick } from '../models/timerTick.model';
import { TimerTickDto } from '../models/timertickDto.model';

@Injectable({
  providedIn: 'root'
})
export class TimerTickService {
  listOfIntervals: TimerTick[] = [];

  addTimerTick(timerTick: TimerTick) {
    const index = this.listOfIntervals.length;
    this.listOfIntervals.splice(index, 0, timerTick);
    this.listOfIntervals = this.listOfIntervals.sort(this.orderByIndex);
  }

  updateTimerTick(newTimerTick: TimerTick) {
    const index = this.listOfIntervals.findIndex(
      item => item.id === newTimerTick.id
    );

    if (index === -1) {
      return;
    }
    this.listOfIntervals[index] = newTimerTick;
    this.listOfIntervals = this.listOfIntervals.sort(this.orderByIndex);
  }

  deleteTimerTick(timerTickId: number) {
    this.listOfIntervals = this.listOfIntervals.filter(
      item => item.id !== timerTickId
    );
    this.listOfIntervals = this.listOfIntervals.sort(this.orderByIndex);
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

  createFrom(timerTickDto: TimerTickDto): TimerTick {
    const timerTick = new TimerTick();
    timerTick.topic = timerTickDto.topic;
    timerTick.intervalSeconds = timerTickDto.intervalSeconds;
    timerTick.secondsLeft = timerTickDto.intervalSeconds;
    timerTick.id = timerTickDto.id;
    timerTick.position = timerTickDto.position;
    return this.appylValues(timerTick);
  }

  getTotalPercentage() {
    const totalTime = this.getTotalTime();

    if (totalTime === 0) {
      return 0;
    }

    const allSecondsLeft = this.getAllSecondsLeft();

    const percentage = (100 / totalTime) * allSecondsLeft;
    return Math.round(percentage * 100) / 100;
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
        this.applyValuesPerTick(timerTick);
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

  private applyValuesPerTick(currentTimerTick: TimerTick) {
    currentTimerTick.timeLeft = this.getTimeLeft(currentTimerTick.secondsLeft);

    currentTimerTick.percentage = this.getPercentage(
      currentTimerTick.intervalSeconds,
      currentTimerTick.secondsLeft
    );

    currentTimerTick.secondsRan = this.calculateSecondsRan(
      currentTimerTick.intervalSeconds,
      currentTimerTick.secondsLeft
    );
  }

  private calculateIntervalTime(intervalSeconds: number) {
    const duration = moment.duration(intervalSeconds, 'seconds');
    return moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
  }

  private calculateSecondsRan(intervalSeconds: number, secondsLeft: number) {
    if (secondsLeft === 0) {
      return '0';
    }
    const seconds = Math.round(intervalSeconds - secondsLeft) || 0;

    const duration = moment.duration(seconds, 'seconds');
    return moment.utc(duration.asMilliseconds()).format('mm:ss');
  }

  private getPercentage(intervalSeconds: number, secondsLeft: number) {
    return Math.round((secondsLeft / intervalSeconds) * 100) || 0;
  }

  private getTimeLeft(secondsLeft: number) {
    const duration = moment.duration(secondsLeft, 'seconds');
    return moment.utc(duration.asMilliseconds()).format('mm:ss');
  }

  private appylValues(timerTick: TimerTick) {
    const clone = { ...timerTick };
    clone.id = timerTick.id;
    clone.secondsRan = this.calculateSecondsRan(
      clone.intervalSeconds,
      clone.secondsLeft
    );

    clone.intervalTime = this.calculateIntervalTime(clone.intervalSeconds);
    clone.finished = clone.secondsLeft === 0;

    clone.percentage = this.getPercentage(
      clone.intervalSeconds,
      clone.secondsLeft
    );

    clone.timeLeft = this.getTimeLeft(clone.intervalSeconds);
    return clone;
  }

  private orderByIndex(a: TimerTick, b: TimerTick) {
    if (a.position < b.position) {
      console.log('-1');
      return -1;
    }
    if (a.position > b.position) {
      console.log('1');
      return 1;
    }
    console.log('0');
    return 0;
  }
}
