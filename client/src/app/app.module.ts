import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { NgProgressModule } from '@ngx-progressbar/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import {
  AuthModule,
  AuthWellKnownEndpoints,
  OidcConfigService,
  OidcSecurityService,
  OpenIDImplicitFlowConfiguration
} from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.module';
import { StartComponent } from './start/start.component';
import { TalkFormComponent } from './talk-form/talk-form.component';
import { TalkPartListComponent } from './talk-part-list/talk-part-list.component';
import { TalksDetailsComponent } from './talks-details/talks-details.component';
import { TalksOverviewComponent } from './talks-overview/talks-overview.component';
import {
  StickyPolyFillDirective,
  TotalTimeComponent
} from './total-time/total-time.component';

export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load_using_stsServer(environment.stsServer);
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
    StickyPolyFillDirective,
    StartComponent
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
    ScrollToModule.forRoot(),
    SharedModule,
    NgProgressModule.forRoot()
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

      openIDImplicitFlowConfiguration.stsServer = environment.stsServer;
      openIDImplicitFlowConfiguration.redirect_url = environment.clientApp;
      openIDImplicitFlowConfiguration.client_id = 'timertalkclient';
      openIDImplicitFlowConfiguration.response_type = 'id_token token';
      openIDImplicitFlowConfiguration.scope =
        'timer_talk_scope openid profile email';
      openIDImplicitFlowConfiguration.post_logout_redirect_uri =
        environment.clientApp + '/#/overview';
      openIDImplicitFlowConfiguration.start_checksession = false;
      openIDImplicitFlowConfiguration.silent_renew = true;
      openIDImplicitFlowConfiguration.silent_redirect_url =
        environment.clientApp;
      openIDImplicitFlowConfiguration.silent_renew_url =
        environment.clientApp + '/silent-renew.html';
      openIDImplicitFlowConfiguration.post_login_route = '/#/overview';
      openIDImplicitFlowConfiguration.forbidden_route = '/#/overview';
      openIDImplicitFlowConfiguration.unauthorized_route = '/#/overview';
      openIDImplicitFlowConfiguration.log_console_warning_active = !environment.production;
      openIDImplicitFlowConfiguration.log_console_debug_active = !environment.production;
      openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;

      const authWellKnownEndpoints = new AuthWellKnownEndpoints();
      authWellKnownEndpoints.setWellKnownEndpoints(
        this.oidcConfigService.wellKnownEndpoints
      );

      this.oidcSecurityService.setupModule(
        openIDImplicitFlowConfiguration,
        authWellKnownEndpoints
      );
    });

    console.log('APP STARTING');
  }
}
