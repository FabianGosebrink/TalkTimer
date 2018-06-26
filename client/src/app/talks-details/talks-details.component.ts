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
import { TimerTickDto } from '../models/timertickDto.model';
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

  ngOnDestroy(): void {
    this.timerTickService.resetTimerTicks();
  }

  intervalAdded(timerTick: TimerTick) {
    const talkId = this.activatedRoute.snapshot.params['talkId'];
    this.talkStorageService
      .addToTalk(talkId, timerTick)
      .subscribe((addedTimerTickDto: TimerTickDto) => {
        const addedTimerTick = this.timerTickService.createFrom(
          addedTimerTickDto
        );
        this.timerTickService.addTimerTick(addedTimerTick);
        this.setTotalTimeAndPercentage();
      });
  }

  intervalUpdated(updateModel: TimerTickUpdateModel) {
    const talkId = this.activatedRoute.snapshot.params['talkId'];
    this.talkStorageService
      .updateTimerTick(talkId, updateModel)
      .subscribe((updatedTimerTickDto: TimerTickDto) => {
        const updatedTimerTick = this.timerTickService.createFrom(
          updatedTimerTickDto
        );
        this.timerTickService.updateTimerTick(updatedTimerTick);
        this.setTotalTimeAndPercentage();
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

  indexChanged(indexChangedObject: any) {
    const movedUp = indexChangedObject.direction === 'up';

    if (movedUp) {
      this.moveUpInternal(
        this.timerTickService.listOfIntervals,
        indexChangedObject.timerTick
      );
    } else {
      this.moveDownInternal(
        this.timerTickService.listOfIntervals,
        indexChangedObject.timerTick
      );
    }

    const updateModels = this.timerTickService.listOfIntervals.map(
      (element, index) => {
        element.position = index;
        return new TimerTickUpdateModel(element);
      }
    );

    const talkId = this.activatedRoute.snapshot.params['talkId'];
    this.talkStorageService
      .updateMultipleTimerTicks(talkId, updateModels)
      .subscribe(() => console.log('saved'));
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

        this.applyValuesPerTick(currentTimerTick);

        if (currentTimerTick.secondsLeft === 0) {
          currentTimerTick.currentActive = false;
          this.triggerScrollTo(currentTimerTick.id);
        }
      });
  }

  // maybe move that into service
  private applyValuesPerTick(currentTimerTick: TimerTick) {
    console.log(currentTimerTick.secondsLeft);
    currentTimerTick.timeLeft = this.timerTickService.getTimeLeft(
      currentTimerTick.secondsLeft
    );
    currentTimerTick.percentage = this.timerTickService.getPercentage(
      currentTimerTick.intervalSeconds,
      currentTimerTick.secondsLeft
    );

    currentTimerTick.timeLeft = this.timerTickService.getTimeLeft(
      currentTimerTick.secondsLeft
    );

    currentTimerTick.secondsRan = this.timerTickService.calculateSecondsRan(
      currentTimerTick.intervalSeconds,
      currentTimerTick.secondsLeft
    );
  }

  private setInitialtimerTicksForTalk() {
    this.timerTickService.resetTimerTicks();
    const id = this.activatedRoute.snapshot.params['talkId'];
    this.selectedTalk$ = this.talkStorageService.getSingle(id);
    this.talkStorageService
      .getAllTimerTicks(id)
      .subscribe((result: TimerTickDto[]) => {
        const timerTicks = result.map(element => {
          return this.timerTickService.createFrom(element);
        });

        timerTicks.forEach(toAdd => {
          this.timerTickService.addTimerTick(toAdd);
        });
        this.setTotalTimeAndPercentage();
      });
  }
  private fireDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$ = new Subject();
  }

  private triggerScrollTo(id: number) {
    const config: ScrollToConfigOptions = {
      target: id.toString().toLowerCase()
    };

    this.scrollToService.scrollTo(config);
  }

  private moveUpInternal(array, element) {
    this.move(array, element, -1);
  }

  private moveDownInternal(array, element) {
    this.move(array, element, 1);
  }

  private move(array, element, delta) {
    const index = array.indexOf(element);
    const newIndex = index + delta;
    if (newIndex < 0 || newIndex === array.length) {
      return;
    }
    const indexes = [index, newIndex].sort((a, b) => a - b);
    array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]);
  }
}
