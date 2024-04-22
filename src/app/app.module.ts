import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RegComponent } from './auth/reg.component';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatNativeDateModule } from '@angular/material/core';
import { HomeComponent } from './home/home.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthGuard } from './auth-guard.service';
import { EventFormComponent } from './event-form/event-form.component';
import { ProfileComponent } from './profile/profile.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { EventsViewComponent } from './events-view/events-view.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { MessagingService } from './messaging.service';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
//import { AngularFireAuthModule } from '@angular/fire/auth';
// import { AsyncPipe } from '../../node_modules/@angular/common';
import { PlayersSortPipe } from './pipes/players-sort.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import {FileNameDialogComponent} from './home/file-name-dialog.component';



@NgModule({
  declarations: [
    PlayersSortPipe,
    AppComponent,
    RegComponent,
    HomeComponent,
    EventFormComponent,
    ProfileComponent,
    EventsViewComponent,
    FileNameDialogComponent
  ],
  imports: [
    MatSnackBarModule,
    MatDialogModule,
    AngularFireDatabaseModule,
    // AsyncPipe,
    AngularFireAuthModule,
    MatListModule,
    BrowserModule,
    MatDividerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule,
    MatNativeDateModule,
    MatTabsModule,
    MatMenuModule,
    MatToolbarModule,
    MatSelectModule,
    MatIconModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

  ],
  providers: [AuthGuard, PlayersSortPipe, MessagingService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
