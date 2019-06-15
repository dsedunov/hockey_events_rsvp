import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StartComponent } from './start/start.component';
import { RegComponent } from './reg/reg.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { environment } from '../environments/environment';
import {MatNativeDateModule} from '@angular/material/core';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StartComponent,
    RegComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    FlexLayoutModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatNativeDateModule,
    NgxAuthFirebaseUIModule.forRoot({
      apiKey: 'your-firebase-apiKey',
      authDomain: 'your-firebase-authDomain',
      databaseURL: 'your-firebase-databaseURL',
      projectId: 'your-firebase-projectId',
      storageBucket: 'your-firebase-storageBucket',
      messagingSenderId: 'your-firebase-messagingSenderId'
  }),
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
