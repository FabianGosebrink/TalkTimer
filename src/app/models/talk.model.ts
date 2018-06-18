import { TimerTick } from './timerTick.model';

export class Talk {
  readonly id: string;
  readonly name: string;

  readonly added: Date;

  timerTicks: TimerTick[] = [];

  constructor(name: string) {
    this.id = this.createGuid();
    this.name = name;
    this.added = new Date();
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
