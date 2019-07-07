import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export interface Stick {
  value: string;
  viewValue: string;
}

export interface GameRole {
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

  sticks: Stick[] = [
    { value: 'left-0', viewValue: 'Левый' },
    { value: 'right-1', viewValue: 'Правый' }
  ];

  roles: GameRole[] = [
    { value: 'goalie-0', viewValue: 'Вратарь' },
    { value: 'defensemen-1', viewValue: 'Защитник' },
    { value: 'forward-2', viewValue: 'Нападающий' }
  ];

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private profileUpdateFormBuilder: FormBuilder,
    private firebaseAuth: AngularFireAuth,
    private snackBar: MatSnackBar,
  ) {
  }

  email = null;
  nickName = null;

  profileUpdateForm = this.profileUpdateFormBuilder.group({
    email: [''],
    nickName: [''],
    name: [''],
    surname: [''],
    stick: [''],
    role: ['']
  });

  ngOnInit() {
    const usersRef = this.afs.collection('users').doc((this.firebaseAuth.auth.currentUser.email).toLowerCase()).ref;
    usersRef.get()
      .then(doc => {
        console.log(doc);
        if (doc.exists) {
          const { email, nickName, name, surname, stick, role } = doc.data();
          this.email = email;
          this.nickName = nickName;
          this.profileUpdateForm.setValue({
            email,
            nickName,
            name,
            surname,
            stick,
            role,
          });
        } else {
          console.log('No such document!');
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
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
    });
  }

  backToHome() {
    this.router.navigateByUrl('/home');
  }

  // Метод для апдейта базы

  saveProphile() {
    if (this.profileUpdateForm.status === 'VALID') {
      const newUserData = this.profileUpdateForm.value;
      this.afs.collection('users').doc((this.email.toLowerCase())).set(newUserData)
        .then(() => {
          this.snackBar.open('Данные успешно изменены', 'ok', {
            duration: 10000,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}
