import { Injectable } from '@angular/core';
import { TimerTick } from '../models/timerTick.model';

@Injectable({
  providedIn: 'root'
})
export class TimerTickStorageService {
  private PREFIX = 'TALK_TIMER';
  constructor() {}

  save(timerTick: TimerTick) {
    const existing = this.getAll();
    existing.push(timerTick);
    localStorage.setItem(`${this.PREFIX}`, JSON.stringify(existing));
  }

  saveMany(timerTicks: TimerTick[]) {
    const existing = this.getAll();

    timerTicks.forEach(timerTick => {
      existing.push(timerTick);
    });

    localStorage.setItem(`${this.PREFIX}`, JSON.stringify(existing));
  }

  delete(timerTick: TimerTick) {
    let existing = this.getAll();
    this.clearStorage();
    existing = existing.filter(t => t.id !== timerTick.id);
    this.saveMany(existing);
  }

  getAll() {
    const items = localStorage.getItem(`${this.PREFIX}`) || '[]';
    return JSON.parse(items) as TimerTick[];
  }

  private clearStorage() {
    localStorage.removeItem(`${this.PREFIX}`);
  }
}
