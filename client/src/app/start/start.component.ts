import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  constructor(private readonly oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {}

  login() {
    this.oidcSecurityService.authorize();
  }
}
