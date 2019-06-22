import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export interface stick {
  value: string;
  viewValue: string;
}

export interface gameRole {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  stickSelected = '';
  roleSelected = '';

  sticks: stick[] = [
    {value: 'left-0', viewValue: 'Левый'},
    {value: 'right-1', viewValue: 'Правый'}
  ];

  roles: gameRole[] = [
    {value: 'goalie-0', viewValue: 'Вратарь'},
    {value: 'defensemen-1', viewValue: 'Защитник'},
    {value: 'forward-2', viewValue: 'Нападающий'}
  ];

  constructor(
    private router: Router,
    private profileUpdateFormBuilder: FormBuilder,
    private firebaseAuth: AngularFireAuth,
    private snackBar: MatSnackBar,
    ) { }
    
    profileUpdateForm = this.profileUpdateFormBuilder.group({
      stick: [''],
      role: ['']
    });

  ngOnInit() {
  }
  

  openSnackBar(message: string) {
    this.snackBar.open(message, 'ok', {
      duration: 10000,
    });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut().then(() => {
        this.openSnackBar('Давай до свидания');
        this.router.navigate(['']);
     });;
  }

  backToHome() {
    this.router.navigateByUrl('/home');
  }

  // Метод для апдейта базы

}
