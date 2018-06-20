import { Guid } from '../services/guid.service';
import { TimerTick } from './timerTick.model';

export class Talk {
  readonly id: string;
  readonly name: string;

  readonly added: Date;

  timerTicks: TimerTick[] = [];

  constructor(name: string) {
    this.id = Guid.MakeNew().ToString();
    this.name = name;
    this.added = new Date();
  }
}
