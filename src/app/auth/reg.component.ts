import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.scss']
})
export class RegComponent implements OnInit {
  private user: any;

  stickSelected = '';
  roleSelected = '';

  sticks: Stick[] = [
    { value: 'Левый', viewValue: 'Левый' },
    { value: 'Правый', viewValue: 'Правый' }
  ];

  roles: GameRole[] = [
    { value: 'Вратарь', viewValue: 'Вратарь' },
    { value: 'Защитник', viewValue: 'Защитник' },
    { value: 'Нападающий', viewValue: 'Нападающий' }
  ];

  constructor(
    private router: Router,
    private firebaseAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private registerFormBuilder: FormBuilder,
    private loginFormBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.user = firebaseAuth.authState;
  }

  loginForm = this.loginFormBuilder.group({
    email: [''],
    password: ['']
  });
  registerForm = this.registerFormBuilder.group({
    email: [''],
    password: [''],
    nickName: [''],
    name: [''],
    surname: [''],
    role: [''],
    stick: ['']
  });

  ngOnInit() {
    if (this.user) {
      this.router.navigateByUrl('/home');
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'ok', {
      duration: 10000,
    });
  }

  createUser(uid: string) {
    const userData = {
      ...this.registerForm.value,
      uid,
      active: false,
      password: null,
    };

    return this.afs.collection('users').doc((this.registerForm.value.email.toLowerCase())).set(userData);
  }

  register() {
    if (this.registerForm.status === 'VALID') {
      this.firebaseAuth
        .createUserWithEmailAndPassword((this.registerForm.value.email).toLowerCase(), this.registerForm.value.password)
        .then(value => {
          console.log(value);
          this.createUser(value.user.uid)
            .then(res => {
              this.openSnackBar('Успех');
              this.router.navigate(['']);
              console.log(res);
            });
        })
        .catch(err => {
          this.openSnackBar(err.message);
        });
    } else {
      this.openSnackBar('Не все поля заполнены.');
    }
  }

  login() {
    if (this.loginForm.status === 'VALID') {
      this.firebaseAuth
        .signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
        .then(res => {
          const usersRef = this.afs.collection('users').doc((this.loginForm.value.email.toLowerCase())).ref;
          usersRef.get()
            .then(doc => {
              console.log(res);
              this.openSnackBar('Успех');
              this.router.navigateByUrl('/home');
            })
            .catch(err => {
              console.log(err);
              this.firebaseAuth
                .signOut()
                .then(response => {
                  console.log(response);
                  this.openSnackBar('Ваш аккаунт находится на валидации.');
                })
                .catch(error => {
                  console.log(error);
                  this.openSnackBar('Лшибка сервера.');
                });
            });
        })
        .catch(err => {
          this.openSnackBar(err.message);
        });
    } else {
      this.openSnackBar('Не все поля заполнены.');
    }
  }
}
