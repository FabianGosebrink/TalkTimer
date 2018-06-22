import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { StartComponent } from './start/start.component';
import { TalksDetailsComponent } from './talks-details/talks-details.component';
import { TalksOverviewComponent } from './talks-overview/talks-overview.component';

export const AppRoutes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    component: StartComponent
  },
  {
    path: 'overview',
    component: TalksOverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'details/:talkId',
    component: TalksDetailsComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'start' }
];
