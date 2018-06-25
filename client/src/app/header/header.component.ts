import { Component, OnDestroy, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';
import { CurrentUserService } from '../shared/services/current-user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthorizedSubscription: Subscription | undefined;
  isAuthorized = false;

  userDataSubscription: Subscription | undefined;
  userData: any;

  constructor(
    public oidcSecurityService: OidcSecurityService,
    private readonly currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService
      .getIsAuthorized()
      .subscribe((isAuthorized: boolean) => {
        this.isAuthorized = isAuthorized;

        if (this.isAuthorized) {
          console.log('isAuthorized getting data');
        }
      });

    this.userDataSubscription = this.oidcSecurityService
      .getUserData()
      .subscribe((userData: any) => {
        if (userData && userData.role) {
          this.currentUserService.setUser(userData.name);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.isAuthorizedSubscription) {
      this.isAuthorizedSubscription.unsubscribe();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
