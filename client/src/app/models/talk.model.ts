import { TimerTick } from './timerTick.model';

export class Talk {
  readonly id: number;
  readonly name: string;

  readonly added: Date;

  timerTicks: TimerTick[] = [];

  constructor(name: string) {
    this.name = name;
    this.added = new Date();
  }
}
