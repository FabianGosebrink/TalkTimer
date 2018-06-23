import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  constructor(
    private readonly oidcSecurityService: OidcSecurityService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.oidcSecurityService.getIsAuthorized().subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/overview']);
      }
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }
}
