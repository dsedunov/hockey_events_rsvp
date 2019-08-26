import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export interface GameType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-event',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  gameTypeSelected = '';


  types: GameType[] = [
    { value: 'Тренировка', viewValue: 'Тренировка' },
    { value: 'Игра', viewValue: 'Игра' }
  ];

  visibility: string;
  vTypes: string[] = ['Для всех', 'Турнир'];


  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private eventFormBuilder: FormBuilder,
    private firebaseAuth: AngularFireAuth,
    private snackBar: MatSnackBar,
  ) {
  }

  eventForm = this.eventFormBuilder.group({
    where: [''],
    gameDay: [''],
    vType: [''],
    gameType: [''],
    rival: ['']
  });

  ngOnInit() {
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, 'ok', {
      duration: 10000,
    });
  }

  backToHome() {
    this.router.navigateByUrl('/home');
  }

  createEvent() {
    if (this.eventForm.status === 'VALID') {
      console.log(this.eventForm.value);
      const eventInfo = { ...this.eventForm.value };
      eventInfo.gameDay = +new Date(eventInfo.gameDay);
      return this.afs.collection('events').doc(this.eventForm.value.gameDay).set(eventInfo).then(() => {
        this.snackBar.open('Молодец', 'ok', {
          duration: 10000,
        });
        this.router.navigate(['/home']);
      }).catch(err => {
        console.log(err);
      });
    }
  }

}
