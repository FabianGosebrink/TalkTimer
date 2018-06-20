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
  @Output() intervalAdded = new EventEmitter();
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
      topic: new FormControl('', Validators.required)
    });
  }

  addTimer() {
    const enteredValueInSeconds = +this.form.value.timeInMinutes * 60;

    const topic = this.form.value.topic || '';
    const timerTick = new TimerTick(topic, enteredValueInSeconds);
    this.intervalAdded.emit(timerTick);
    this.form.reset();
  }

  resetTimers() {
    this.form.reset();
    this.reset.emit();
  }

  startTimers() {
    this.start.emit();
  }
}
