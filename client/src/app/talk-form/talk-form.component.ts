import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimerTickDto } from '../models/timertickDto.model';
import { TimerTickUpdateModel } from '../models/timerTickUpdate.model';
import { TimerTickService } from '../services/timer-tick.service';

@Component({
  selector: 'app-talk-form',
  templateUrl: './talk-form.component.html',
  styleUrls: ['./talk-form.component.css']
})
export class TalkFormComponent implements OnInit {
  @Input() timerStarted = false;
  @Input()
  set timerTickToUpdate(value: TimerTickUpdateModel) {
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

  constructor(private readonly timerTickService: TimerTickService) {}

  ngOnInit() {
    this.form = new FormGroup({
      timeInMinutes: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ]),
      topic: new FormControl('', Validators.required),
      id: new FormControl(),
      position: new FormControl()
    });
  }

  addOrUpdateTimer() {
    const enteredValueInSeconds = +this.form.value.timeInMinutes * 60;
    if (this.form.value.id) {
      const toSend = this.form.value as TimerTickUpdateModel;
      toSend.intervalSeconds = enteredValueInSeconds;
      this.intervalUpdated.emit(toSend);
    } else {
      const topic = this.form.value.topic || '';

      const temp = {
        topic,
        intervalSeconds: enteredValueInSeconds
      } as TimerTickDto;
      temp.position = this.timerTickService.listOfIntervals.length + 1;
      const timerTick = this.timerTickService.createFrom(temp);
      this.intervalAdded.emit(timerTick);
    }
    this.form.reset();
  }

  setTimerInForm(timerTickUpdateModel: TimerTickUpdateModel) {
    this.form.setValue({
      timeInMinutes: timerTickUpdateModel.intervalSeconds / 60,
      topic: timerTickUpdateModel.topic,
      id: timerTickUpdateModel.id,
      position: timerTickUpdateModel.position
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
