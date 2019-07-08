import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  toggle = true;
  status = 'Enable';
  eventsFuture: Array<any>;
  eventsPast: Array<any>;
  eventsCollection: AngularFirestoreCollection<any>;
  user = null;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  async ngOnInit() {
    const usersRef = this.afs.collection('users').doc((this.firebaseAuth.auth.currentUser.email).toLowerCase()).ref;
    await usersRef.get()
      .then(doc => {
        if (doc.exists) {
          this.user = doc.data();
          this.user.uid = this.firebaseAuth.auth.currentUser.uid;
        } else {
          console.log('No such document!');
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
    // this.eventsCollection = this.afs.collection('events', ref => ref.where('gameDay', '==', 'Для всех').orderBy('gameDay'));
    this.eventsCollection = this.afs.collection('events', ref => ref.limit(10).orderBy('gameDay', 'desc'));
    this.eventsCollection.snapshotChanges().subscribe(eventsList => {
      const events = eventsList.map(item => {
        let whatIAmAnswer = false;
        const players = item.payload.doc.data().players && item.payload.doc.data().players.reduce((ARplayers, player) => {
          if (player.uid === this.user.uid) {
            whatIAmAnswer = player.status;
          }
          ARplayers[player.status].push(player);
          return ARplayers;
        }, { accept: [], reject: [] }) || { accept: [], reject: [] };
        const { gameDay } = item.payload.doc.data();
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data(),
          gameDayISO: gameDay,
          gameDay: new Date(gameDay).toLocaleDateString('en-US'),
          players,
          whatIAmAnswer,
        };
      });
      this.eventsFuture = events.filter(event => event.gameDayISO > +new Date());
      this.eventsPast = events.filter(event => event.gameDayISO < +new Date());

    });
  }

  accessInvite(eventId, players, status) {
    const { name, surname, role } = this.user;

    const oldPlayers = [...players.accept, ...players.reject];
    const currUserUid = this.user.uid;
    const color = '';
    const matchUp = '';
    const oldRecordId = oldPlayers.findIndex(player => player.uid === currUserUid);
    oldPlayers.splice(oldRecordId, oldRecordId);
    players = [...oldPlayers, {
      status,
      name,
      surname,
      role,
      uid: this.user.uid,
      color,
      matchUp
    }];

    this.afs.collection('events').doc(eventId).update({
      players
    })
      .then(res => {
        this.snackBar.open(status === 'accept' ? 'Ждём тебя' : 'У тебя есть время передумать', 'ok', {
          duration: 10000,
        });
      })
      .catch(err => {
        console.log(err);
      });
    this.toggle = !this.toggle;
    this.status = this.toggle ? 'Enable' : 'Disable';
  }

  createEvent() {
    this.router.navigateByUrl('/event');

  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  viewDetails() {
    this.router.navigateByUrl('/view');
  }

  copyMessage(playersObj: Array<any>) {
    const playersString: string = playersObj
      .reduce((startStr, player, i) => {
        return `${ startStr }${ i ? '\n' : '' }${ player.name } ${ player.surname }`;
      }, '');
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = playersString;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
