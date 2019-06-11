import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.scss']
})
export class RegComponent implements OnInit {

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
  }

  save() {
    this.db.collection('users').add(
        { name: 'user' }
      );
  }

}
