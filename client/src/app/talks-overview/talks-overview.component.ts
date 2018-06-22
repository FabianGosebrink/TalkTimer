import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Talk } from '../models/talk.model';
import { TalkStorageService } from '../services/talk-storage.service';

@Component({
  selector: 'app-talks-overview',
  templateUrl: './talks-overview.component.html',
  styleUrls: ['./talks-overview.component.css']
})
export class TalksOverviewComponent implements OnInit {
  form: FormGroup;
  talks$: Observable<Talk[]>;
  constructor(private readonly talkStorageService: TalkStorageService) {}

  ngOnInit() {
    this.talks$ = this.talkStorageService.getAll();

    this.form = new FormGroup({
      talkName: new FormControl('', Validators.required)
    });
  }

  addTalk() {
    const talkName = this.form.value.talkName;
    const toSave = new Talk(talkName);
    this.talks$ = this.talkStorageService.add(toSave).pipe(
      tap(() => this.form.reset()),
      switchMap(() => this.talkStorageService.getAll())
    );
  }

  deleteTalk(talk: Talk, event: Event) {
    if (!confirm('Really delete')) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    this.talkStorageService.delete(talk);

    this.talks$ = this.talkStorageService
      .delete(talk)
      .pipe(switchMap(() => this.talkStorageService.getAll()));
  }
}
