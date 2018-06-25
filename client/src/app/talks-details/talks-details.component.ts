import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ScrollToConfigOptions,
  ScrollToService
} from '@nicky-lenaers/ngx-scroll-to';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Talk } from '../models/talk.model';
import { TimerTick } from '../models/timerTick.model';
import { TimerTickUpdateModel } from '../models/timerTickUpdate.model';
import { TalkStorageService } from '../services/talk-storage.service';
import { TimerTickService } from '../services/timer-tick.service';

@Component({
  selector: 'app-talks-details',
  templateUrl: './talks-details.component.html',
  styleUrls: ['./talks-details.component.css']
})
export class TalksDetailsComponent implements OnInit, OnDestroy {
  selectedTalk$: Observable<Talk>;
  timerTickToUpdate: TimerTickUpdateModel;

  totalTime: number;
  totalPercentage: number;
  talkIsRunning = false;
  private timers: Observable<TimerTick>[] = [];
  private startIndex = 0;
  private destroy$ = new Subject();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    public readonly timerTickService: TimerTickService,
    private readonly talkStorageService: TalkStorageService,
    private readonly scrollToService: ScrollToService
  ) {}

  ngOnInit() {
    this.setInitialtimerTicksForTalk();
  }

  private setInitialtimerTicksForTalk() {
    this.timerTickService.resetTimerTicks();
    const id = this.activatedRoute.snapshot.params['talkId'];
    this.selectedTalk$ = this.talkStorageService.getSingle(id);
    this.talkStorageService
      .getAllTimerTicks(id)
      .subscribe((result: TimerTick[]) => {
        result.forEach(timerTick => {
          const toAdd = new TimerTick(
            timerTick.topic,
            timerTick.intervalSeconds
          );
          toAdd.id = timerTick.id;
          this.timerTickService.addTimerTick(toAdd);
        });
        this.setTotalTimeAndPercentage();
      });
  }

  ngOnDestroy(): void {
    this.timerTickService.resetTimerTicks();
  }

  intervalAdded(timerTick: TimerTick) {
    const talkId = this.activatedRoute.snapshot.params['talkId'];
    this.talkStorageService.addToTalk(talkId, timerTick).subscribe(() => {
      this.timerTickService.addTimerTick(timerTick);
      this.setTotalTimeAndPercentage();
    });
  }

  intervalUpdated(updateModel: TimerTickUpdateModel) {
    const talkId = this.activatedRoute.snapshot.params['talkId'];
    this.talkStorageService
      .updateTimerTick(talkId, updateModel)
      .subscribe((timerTick: TimerTick) => {
        this.setInitialtimerTicksForTalk();
      });
  }

  deleteTimer(timerTick: TimerTick) {
    if (!confirm('Really delete')) {
      return;
    }

    const talkId = this.activatedRoute.snapshot.params['talkId'];
    this.talkStorageService.deleteFromTalk(talkId, timerTick).subscribe(() => {
      this.timerTickService.deleteTimerTick(timerTick.id);
      this.setTotalTimeAndPercentage();
    });
  }

  updateTimer(timerTick: TimerTickUpdateModel) {
    this.timerTickToUpdate = timerTick;
  }

  resetTimers() {
    this.talkIsRunning = false;
    this.fireDestroy();
    this.timers = [];
    this.setInitialtimerTicksForTalk();
  }

  start() {
    this.timers = this.timerTickService.getAllIntervalls();

    this.talkIsRunning = true;

    this.startTimer(this.startIndex);
  }

  private setTotalTimeAndPercentage() {
    this.totalTime = this.timerTickService.getTotalTime();
    this.totalPercentage = this.timerTickService.getTotalPercentage();
  }

  private startTimer(index: number) {
    if (!this.timerTickService.listOfIntervals[index]) {
      this.resetTimers();
      return;
    }

    const currentObservable = this.timers[index];

    currentObservable
      .pipe(
        tap((currentTimerTick: TimerTick) => {
          currentTimerTick.currentActive = true;
        }),
        finalize(() => {
          if (this.talkIsRunning) {
            const newIndex = index + 1;
            this.startTimer(newIndex);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((currentTimerTick: TimerTick) => {
        this.totalPercentage = Math.round(
          this.timerTickService.getTotalPercentage()
        );

        if (currentTimerTick.secondsLeft === 0) {
          currentTimerTick.currentActive = false;
          this.triggerScrollTo(currentTimerTick.id);
        }
      });
  }

  private fireDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$ = new Subject();
  }

  private triggerScrollTo(id: number) {
    const config: ScrollToConfigOptions = { target: id };

    this.scrollToService.scrollTo(config);
  }
}
