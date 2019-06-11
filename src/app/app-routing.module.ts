import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';
import { LoginComponent } from './login/login.component';
import { RegComponent } from './reg/reg.component';

const routes: Routes = [
  {path: '', component: StartComponent},
  {path: 'login', component: LoginComponent},
  {path: 'reg', component: RegComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
