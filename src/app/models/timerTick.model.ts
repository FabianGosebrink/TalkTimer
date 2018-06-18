import * as moment from 'moment';

export class TimerTick {
  private _id: string;
  public get id() {
    return this._id;
  }

  public get finished() {
    return this.secondsLeft === 0;
  }

  public get percentage() {
    return Math.round((this.secondsLeft / this.intervalSeconds) * 100);
  }

  public get minutesLeft() {
    return Math.round(this.secondsLeft / 60);
  }

  public get intervalMinutes() {
    return Math.round(this.intervalSeconds / 60);
  }

  public get secondsRan() {
    if (this.secondsLeft === 0) {
      return 0;
    }
    const seconds = Math.round(this.intervalSeconds - this.secondsLeft) || 0;

    const duration = moment.duration(seconds, 'seconds');
    return moment.utc(duration.asMilliseconds()).format('mm:ss');
  }

  public secondsLeft = 0;
  public currentActive = false;

  constructor(public topic: string, public intervalSeconds: number) {
    this._id = this.createGuid();
  }

  private createGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }
}
