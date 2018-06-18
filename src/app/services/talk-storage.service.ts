import { Injectable } from '@angular/core';
import { Talk } from '../models/talk.model';
import { TimerTick } from '../models/timerTick.model';

@Injectable({
  providedIn: 'root'
})
export class TalkStorageService {
  private PREFIX = 'TALK_TIMER';
  constructor() {}

  add(talk: Talk) {
    const allExisting = this.getAll();
    allExisting.push(talk);
    localStorage.setItem(`${this.PREFIX}`, JSON.stringify(allExisting));
  }

  update(updatedTalk: Talk) {
    const allExisting = this.getAll();

    const existingTalk = allExisting.find(item => item.id === updatedTalk.id);

    if (!existingTalk) {
      return;
    }
    const allOthers = allExisting.filter(item => item.id !== updatedTalk.id);

    this.clearStorage();
    const allnew = [...allOthers, ...[updatedTalk]];
    localStorage.setItem(`${this.PREFIX}`, JSON.stringify(allnew));
  }

  addToTalk(talk: Talk, timerTick: TimerTick) {
    const alltalks = this.getAll();
    const talky = alltalks.find(existingTalk => existingTalk.id === talk.id);
    talky.timerTicks.push(timerTick);
    this.update(talky);
  }

  deleteFromTalk(talk: Talk, timerTick: TimerTick) {
    const allExisting = this.getAll();

    const existingTalk = allExisting.find(item => item.id === talk.id);

    if (!existingTalk) {
      return;
    }
    const allOtherTimeTicks = existingTalk.timerTicks.filter(
      item => item.id !== timerTick.id
    );
    existingTalk.timerTicks = [...allOtherTimeTicks];
    this.update(existingTalk);
  }

  saveMany(talks: Talk[]) {
    const existing = this.getAll();

    talks.forEach(timerTick => {
      existing.push(timerTick);
    });

    localStorage.setItem(`${this.PREFIX}`, JSON.stringify(existing));
  }

  delete(talk: Talk) {
    let existing = this.getAll();
    this.clearStorage();
    existing = existing.filter(t => t.id !== talk.id);
    this.saveMany(existing);
  }

  getAll() {
    const items = localStorage.getItem(`${this.PREFIX}`) || '[]';
    return JSON.parse(items) as Talk[];
  }

  getSingle(id: string) {
    const items = localStorage.getItem(`${this.PREFIX}`) || '[]';
    return (JSON.parse(items) as Talk[]).find(item => item.id === id);
  }

  private clearStorage() {
    localStorage.removeItem(`${this.PREFIX}`);
  }
}
