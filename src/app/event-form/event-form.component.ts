import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export interface gameType {
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


  types: gameType[] = [
    {value: 'practice-0', viewValue: 'Тренировка'},
    {value: 'game-1', viewValue: 'Игра'}
  ];

  visibility: string;
  vTypes: string[] = ['Для всех', 'Турнир'];


  constructor(
    private router: Router,
    private eventFormBuilder: FormBuilder,
    private firebaseAuth: AngularFireAuth,
    private snackBar: MatSnackBar,
    ) { }
    
    eventForm = this.eventFormBuilder.group({
      where: [''],
      gameDay: [''],
      vType:[''],
      gameType: ['']
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


}
