import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.scss']
})
export class RegComponent implements OnInit {
  private user: any;

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
  });

  ngOnInit() {
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
      stick: [],
      active: [],
      role: null,
    };

    return this.afs.collection('users').doc(this.registerForm.value.email).set(userData);
  }

  register() {
    if (this.registerForm.status === 'VALID') {
      this.firebaseAuth
        .auth
        .createUserWithEmailAndPassword(this.registerForm.value.email, this.registerForm.value.password)
        .then(value => {
          console.log(value);
          this.createUser(value.user.uid)
            .then(res => {
              this.openSnackBar('Успех');
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
        .auth
        .signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
        .then(res => {
          console.log(res);
          this.openSnackBar('Успех');
          this.router.navigateByUrl('/home');
        })
        .catch(err => {
          this.openSnackBar(err.message);
        });
    } else {
      this.openSnackBar('Не все поля заполнены.');
    }
  }
}
