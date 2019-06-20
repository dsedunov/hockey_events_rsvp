import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.scss']
})
export class RegComponent implements OnInit {
  constructor(
    private db: AngularFirestore,
    private formBuilder: FormBuilder
  ) {
  }

  personForm = this.formBuilder.group({
    email: [''],
    password: [''],
    nickName: [''],
    name: [''],
    surname: [''],
    // isAdmin: [null],
    // stick: [Array],
    // active: [Boolean],
    // access: [Boolean],
    // role: [null]

  });

  ngOnInit() {
  }

  save() {
    if (this.personForm.status === 'VALID') {
      this.db.collection('users').add(
        this.personForm.value
      ).then;{alert('Успешно!');};
    } else {
      console.log('invalid status');
    }

  }


}
