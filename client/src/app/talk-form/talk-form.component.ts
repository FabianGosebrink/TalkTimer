import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimerTick } from '../models/timerTick.model';

@Component({
  selector: 'app-talk-form',
  templateUrl: './talk-form.component.html',
  styleUrls: ['./talk-form.component.css']
})
export class TalkFormComponent implements OnInit {
  @Input() timerStarted = false;
  @Input()
  set timerTickToUpdate(value: TimerTick) {
    if (!value) {
      return;
    }

    this.setTimerInForm(value);
  }
  @Output() intervalAdded = new EventEmitter();
  @Output() intervalUpdated = new EventEmitter();
  @Output() start = new EventEmitter();
  @Output() reset = new EventEmitter();
  form: FormGroup;

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      timeInMinutes: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ]),
      topic: new FormControl('', Validators.required),
      id: new FormControl()
    });
  }

  addOrUpdateTimer() {
    if (this.form.value.id) {
      this.intervalUpdated.emit(this.form.value);
    } else {
      const enteredValueInSeconds = +this.form.value.timeInMinutes * 60;
      const topic = this.form.value.topic || '';
      const timerTick = new TimerTick(topic, enteredValueInSeconds);
      this.intervalAdded.emit(timerTick);
    }
    this.form.reset();
  }

  setTimerInForm(timerTick: TimerTick) {
    this.form.setValue({
      timeInMinutes: timerTick.intervalSeconds / 60,
      topic: timerTick.topic,
      id: timerTick.id
    });
  }

  resetTimers() {
    this.form.reset();
    this.reset.emit();
  }

  startTimers() {
    this.start.emit();
  }
}
