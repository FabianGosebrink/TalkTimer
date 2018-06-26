import { TimerTick } from './timerTick.model';

export class TimerTickUpdateModel {
  public id: number;
  public topic: string;
  public intervalSeconds: number;
  public position: number;

  constructor(timerTick: TimerTick) {
    this.id = timerTick.id;
    this.topic = timerTick.topic;
    this.intervalSeconds = timerTick.intervalSeconds;
    this.position = timerTick.position;
  }
}
