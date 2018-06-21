import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { HeaderComponent } from './header/header.component';
import { TalkFormComponent } from './talk-form/talk-form.component';
import { TalkPartListComponent } from './talk-part-list/talk-part-list.component';
import { TalksDetailsComponent } from './talks-details/talks-details.component';
import { TalksOverviewComponent } from './talks-overview/talks-overview.component';
import { StickyPolyFillDirective, TotalTimeComponent } from './total-time/total-time.component';

import { environment } from '../environments/environment';

import {
  AuthModule,
  OidcSecurityService,
  OpenIDImplicitFlowConfiguration,
  OidcConfigService,
  AuthWellKnownEndpoints
} from 'angular-auth-oidc-client';

export function loadConfig(oidcConfigService: OidcConfigService) {
  console.log('APP_INITIALIZER STARTING');
  return () => oidcConfigService.load_using_stsServer('https://localhost:44318');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TalkFormComponent,
    TotalTimeComponent,
    TalkPartListComponent,
    TalksOverviewComponent,
    TalksDetailsComponent,
    StickyPolyFillDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthModule.forRoot(),
    RouterModule.forRoot(AppRoutes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    }),
    ScrollToModule.forRoot()
  ],
  providers: [
    OidcConfigService,
    OidcSecurityService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true
    },
    OidcSecurityService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private oidcConfigService: OidcConfigService
  ) {

    this.oidcConfigService.onConfigurationLoaded.subscribe(() => {

      const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();

      openIDImplicitFlowConfiguration.stsServer = 'https://localhost:44318';
      openIDImplicitFlowConfiguration.redirect_url = 'https://localhost:4200';
      openIDImplicitFlowConfiguration.client_id = 'timertalkclient';
      openIDImplicitFlowConfiguration.response_type = 'id_token token';
      openIDImplicitFlowConfiguration.scope = 'timer_talk_scope openid profile email';
      openIDImplicitFlowConfiguration.post_logout_redirect_uri = 'https://localhost:44395/unauthorized';
      openIDImplicitFlowConfiguration.start_checksession = false;
      openIDImplicitFlowConfiguration.silent_renew = false;
      openIDImplicitFlowConfiguration.post_login_route = '/overview';
      openIDImplicitFlowConfiguration.forbidden_route = '/overview';
      openIDImplicitFlowConfiguration.unauthorized_route = '/overview';
      openIDImplicitFlowConfiguration.log_console_warning_active = true;
      openIDImplicitFlowConfiguration.log_console_debug_active = false;
      openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;

      const authWellKnownEndpoints = new AuthWellKnownEndpoints();
      authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

      this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);

    });

    console.log('APP STARTING');
  }
}
