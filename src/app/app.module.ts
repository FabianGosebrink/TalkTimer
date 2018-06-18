import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { HeaderComponent } from './header/header.component';
import { TalkFormComponent } from './talk-form/talk-form.component';
import { TalkPartListComponent } from './talk-part-list/talk-part-list.component';
import { TalksDetailsComponent } from './talks-details/talks-details.component';
import { TalksOverviewComponent } from './talks-overview/talks-overview.component';
import { TotalTimeComponent } from './total-time/total-time.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TalkFormComponent,
    TotalTimeComponent,
    TalkPartListComponent,
    TalksOverviewComponent,
    TalksDetailsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
