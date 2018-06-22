import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly oidcSecurityService: OidcSecurityService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.oidcSecurityService.getIsAuthorized().pipe(
      map((isAuthorized: boolean) => {
        if (isAuthorized) {
          return true;
        }

        this.router.navigate(['/start']);
        return false;
      })
    );
  }
}
