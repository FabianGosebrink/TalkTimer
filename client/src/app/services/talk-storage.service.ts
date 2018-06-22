import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Talk } from '../models/talk.model';
import { TimerTick } from '../models/timerTick.model';
import { TimerTickUpdateModel } from '../models/timerTickUpdate.model';

@Injectable({
  providedIn: 'root'
})
export class TalkStorageService {
  private readonly actionUrl: string;
  private readonly talkEndpoint = 'talks/';
  private readonly timerTickEndpoint = 'timerticks/';
  private headers: HttpHeaders = new HttpHeaders();

  constructor(private readonly http: HttpClient) {
    this.actionUrl = environment.server + environment.apiUrl;
  }

  add(talk: Talk) {
    return this.http.post<Talk>(this.actionUrl + this.talkEndpoint, talk, {
      headers: this.headers
    });
  }

  update(updatedTalk: Talk) {
    return this.http.put<Talk>(
      this.actionUrl + this.talkEndpoint,
      updatedTalk,
      { headers: this.headers }
    );
  }

  addToTalk(talkId: string, timerTick: TimerTick) {
    return this.http.post<TimerTick>(
      `${this.actionUrl}${this.talkEndpoint}${talkId}/${
        this.timerTickEndpoint
      }`,
      timerTick,
      { headers: this.headers }
    );
  }

  updateTimerTick(talkId: string, updateModel: TimerTickUpdateModel) {
    return this.http.put<TimerTick>(
      `${this.actionUrl}${this.talkEndpoint}${talkId}/${
        this.timerTickEndpoint
      }${updateModel.id}`,
      updateModel,
      { headers: this.headers }
    );
  }

  deleteFromTalk(talkId: string, timerTick: TimerTick) {
    return this.http.delete(
      `${this.actionUrl}${this.talkEndpoint}${talkId}/${
        this.timerTickEndpoint
      }${timerTick.id}`,
      { headers: this.headers }
    );
  }

  delete(talk: Talk) {
    return this.http.delete(`${this.actionUrl}${this.talkEndpoint}${talk.id}`, {
      headers: this.headers
    });
  }

  getAll() {
    return this.http.get<Talk[]>(this.actionUrl + this.talkEndpoint, {
      headers: this.headers
    });
  }

  getAllTimerTicks(talkId: string) {
    return this.http.get<TimerTick[]>(
      `${this.actionUrl}${this.talkEndpoint}${talkId}/${
        this.timerTickEndpoint
      }`,
      { headers: this.headers }
    );
  }

  getSingle(id: string) {
    return this.http.get<Talk>(`${this.actionUrl}${this.talkEndpoint}${id}`, {
      headers: this.headers
    });
  }
}
