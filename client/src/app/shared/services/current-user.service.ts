import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  username = new BehaviorSubject<string>('');
  constructor() {}

  setUser(username: string) {
    this.username.next(username);
  }
}
