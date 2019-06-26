import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  toggle = true;
  status = 'Enable';
  events: Array<any>;
  eventsCollection: AngularFirestoreCollection<Location>;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // this.eventsCollection = this.afs.collection('events', ref => ref.where('gameDay', '==', 'Для всех').orderBy('gameDay'));
    this.eventsCollection = this.afs.collection('events', ref => ref.limit(10).orderBy('gameDay', 'desc'));
    this.eventsCollection.snapshotChanges().subscribe(eventsList => {
      this.events = eventsList.map(item => {
        return {
          ...item.payload.doc.data(),
          gameDay: new Date(item.payload.doc.data().gameDay).toLocaleDateString("en-US"),
          participant: item.payload.doc.data().participant && item.payload.doc.data().participant.length || 0,
        };
      });
    });
  }

  enableDisableRule(job) {
    this.toggle = !this.toggle;
    this.status = this.toggle ? 'Enable' : 'Disable';
  }

  createEvent() {
    this.router.navigateByUrl('/event');

  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }
}
