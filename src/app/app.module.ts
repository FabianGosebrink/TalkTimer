import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TalkFormComponent } from './talk-form/talk-form.component';
import { TotalTimeComponent } from './total-time/total-time.component';
import { TalkPartListComponent } from './talk-part-list/talk-part-list.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, TalkFormComponent, TotalTimeComponent, TalkPartListComponent],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
