export class TimerTick {
  private _id: string;
  public get id() {
    return this._id;
  }

  public get seconds() {
    return this.nextTimerEndinMilliseconds / 1000;
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

  public secondsLeft = 0;
  public currentActive = false;

  constructor(
    public topic: string,
    public nextTimerEndinMilliseconds: number,
    public intervalSeconds: number
  ) {
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
