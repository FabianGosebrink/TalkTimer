import { Routes } from '@angular/router';
import { TalksDetailsComponent } from './talks-details/talks-details.component';
import { TalksOverviewComponent } from './talks-overview/talks-overview.component';

export const AppRoutes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    component: TalksOverviewComponent
  },
  { path: 'details/:talkId', component: TalksDetailsComponent },
  { path: '**', redirectTo: 'overview' }
];
