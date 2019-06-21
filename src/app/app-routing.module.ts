import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegComponent } from './auth/reg.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth-guard.service';
import { EventFormComponent } from './event-form/event-form.component';

const routes: Routes = [
  { path: '', component: RegComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'event', component: EventFormComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
