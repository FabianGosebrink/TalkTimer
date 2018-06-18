import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimerTickService } from '../services/timer-tick.service';
import { TimerTick } from '../timerTick.model';

@Component({
  selector: 'app-talk-form',
  templateUrl: './talk-form.component.html',
  styleUrls: ['./talk-form.component.css']
})
export class TalkFormComponent implements OnInit {
  @Output() intervalAdded = new EventEmitter();
  @Output() start = new EventEmitter();
  @Output() reset = new EventEmitter();
  form: FormGroup;

  constructor(private readonly timerTickService: TimerTickService) {}

  ngOnInit() {
    this.form = new FormGroup({
      timeInMinutes: new FormControl('', Validators.required),
      topic: new FormControl('', Validators.required)
    });
  }

  addTimer() {
    const completeTimeAlreadyAdded = this.timerTickService.getTotalTime();
    const enteredValueInSeconds = +this.form.value.timeInMinutes * 60;
    const secondsToAdd = completeTimeAlreadyAdded + enteredValueInSeconds;

    const topic = this.form.value.topic || '';
    const timerTick = new TimerTick(
      topic,
      secondsToAdd * 1000,
      enteredValueInSeconds
    );
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
