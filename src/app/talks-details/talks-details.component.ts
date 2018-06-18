import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Talk } from '../models/talk.model';
import { TimerTick } from '../models/timerTick.model';
import { TalkStorageService } from '../services/talk-storage.service';
import { TimerTickService } from '../services/timer-tick.service';

@Component({
  selector: 'app-talks-details',
  templateUrl: './talks-details.component.html',
  styleUrls: ['./talks-details.component.css']
})
export class TalksDetailsComponent implements OnInit, OnDestroy {
  selectedTalk: Talk;

  totalTime: number;
  totalPercentage: number;
  talkIsRunning = false;
  private listOfObservables: Observable<TimerTick>[] = [];
  private startIndex = 0;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    public readonly timerTickService: TimerTickService,
    private readonly talkStorageService: TalkStorageService
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['talkId'];
    this.selectedTalk = this.talkStorageService.getSingle(id);
    this.setInitialtimerTicksForTalk();
  }

  private setInitialtimerTicksForTalk() {
    this.selectedTalk.timerTicks.forEach(timerTick => {
      const toAdd = new TimerTick(timerTick.topic, timerTick.intervalSeconds);
      toAdd.id = timerTick.id;
      this.timerTickService.addTimerTick(toAdd);
    });
  }

  ngOnDestroy(): void {
    this.timerTickService.resetTimerTicks();
  }

  intervalAdded(timerTick: TimerTick) {
    this.timerTickService.addTimerTick(timerTick);
    this.setTotalTimeAndPercentage();
    this.talkStorageService.addToTalk(this.selectedTalk, timerTick);
  }

  deleteTimer(timerTick: TimerTick) {
    this.timerTickService.deleteTimerTick(timerTick);
    this.setTotalTimeAndPercentage();
    this.talkStorageService.deleteFromTalk(this.selectedTalk, timerTick);
  }

  resetTimers() {
    this.timerTickService.resetTimerTicks();
    this.setTotalTimeAndPercentage();
    this.listOfObservables = [];
    this.setInitialtimerTicksForTalk();
  }

  start() {
    this.listOfObservables = this.timerTickService.listOfIntervals.map(item =>
      this.timerTickService.createInterval(item)
    );

    this.talkIsRunning = true;

    this.startTimer(this.startIndex);
  }

  private setTotalTimeAndPercentage() {
    this.totalTime = this.timerTickService.getTotalTime();
    this.totalPercentage = this.timerTickService.getTotalPercentage();
  }

  private startTimer(index: number) {
    if (!this.timerTickService.listOfIntervals[index]) {
      this.talkIsRunning = false;
      return;
    }

    const currentObservable = this.listOfObservables[index];

    currentObservable
      .pipe(
        tap((currentTimerTick: TimerTick) => {
          currentTimerTick.currentActive = true;
        }),
        finalize(() => {
          const newIndex = index + 1;
          this.startTimer(newIndex);
        })
      )
      .subscribe((currentTimerTick: TimerTick) => {
        this.totalPercentage = Math.round(
          this.timerTickService.getTotalPercentage()
        );

        if (currentTimerTick.secondsLeft === 0) {
          currentTimerTick.currentActive = false;
        }
      });
  }
}
