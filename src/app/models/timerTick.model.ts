import * as moment from 'moment';

export class TimerTick {
  private _id: string;
  public get id() {
    return this._id;
  }

  get finished() {
    return this.secondsLeft === 0;
  }

  get percentage() {
    return Math.round((this.secondsLeft / this.intervalSeconds) * 100);
  }

  get timeLeft() {
    const duration = moment.duration(this.secondsLeft, 'seconds');
    return moment.utc(duration.asMilliseconds()).format('mm:ss');
  }

  get intervalTime() {
    const duration = moment.duration(this.intervalSeconds, 'seconds');
    return moment.utc(duration.asMilliseconds()).format('mm:ss');
  }

  get secondsRan() {
    if (this.secondsLeft === 0) {
      return 0;
    }
    const seconds = Math.round(this.intervalSeconds - this.secondsLeft) || 0;

    const duration = moment.duration(seconds, 'seconds');
    return moment.utc(duration.asMilliseconds()).format('mm:ss');
  }

  secondsLeft = 0;
  currentActive = false;

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
