import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss']
})
export class EventsViewComponent implements OnInit {
  selected: string;
  whiteListCollection: AngularFirestoreCollection<any>;
  usersCollection: AngularFirestoreCollection<any>;
  noVotedUsers: Array<any>;
  changedEvent: any;

  constructor(
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventFormBuilder: FormBuilder,
    private firebaseAuth: AngularFireAuth,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((params) => {
      this.changedEvent = JSON.parse(params.param);
    });

    this.whiteListCollection = this.afs.collection('list');
    this.whiteListCollection.snapshotChanges().subscribe(([usersWhiteList]) => {
      const whiteListArr = Object.keys(usersWhiteList.payload.doc.data());
      this.usersCollection = this.afs.collection('users', ref => ref.limit(200));
      this.usersCollection.snapshotChanges().subscribe((usersRef) => {
        const users = usersRef.map(userRef => {
          return userRef.payload.doc.data();
        });
        this.changedEvent.players.accept = this.changedEvent.players.accept
          .sort(({ role: roleA }, { role: roleB }) => {
            return roleA !== 'Вратарь' ? 1 : -1;
          });
        const accptedUID = this.changedEvent.players.accept && this.changedEvent.players.accept.map(player => player.uid);
        const rejectedUID = this.changedEvent.players.reject && this.changedEvent.players.reject.map(player => player.uid);

        this.noVotedUsers = users
          .filter(user => {
            return (whiteListArr.indexOf(user.uid) !== -1 && accptedUID.indexOf(user.uid) === -1 && rejectedUID.indexOf(user.uid) === -1);
          })
          .sort(({ role: roleA }, { role: roleB }) => {
            return roleA !== 'Вратарь' ? 1 : -1;
          });
      });
    });

  }

  backToHome() {
    this.router.navigateByUrl('/home');
  }

  addGuetst() {
    this.changedEvent = {
      ...this.changedEvent,
      gameDay: this.changedEvent.gameDayISO,
      players: [{ name: 'newBoi', status: 'accept' }, ...this.changedEvent.players.accept, ...this.changedEvent.players.reject]
    };
    delete this.changedEvent.gameDayISO;

    this.afs.collection('events').doc(this.changedEvent.id).set(this.changedEvent)
      .then(() => {
        this.snackBar.open('Гость успешно добавлен', 'ok', {
          duration: 10000,
        });
        this.router.navigateByUrl('/home');
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateRoster() {
    this.changedEvent = {
      ...this.changedEvent,
      gameDay: this.changedEvent.gameDayISO,
      players: [...this.changedEvent.players.accept, ...this.changedEvent.players.reject]
    };
    delete this.changedEvent.gameDayISO;

    this.afs.collection('events').doc(this.changedEvent.id).set(this.changedEvent)
      .then(() => {
        this.snackBar.open('Данные успешно изменены', 'ok', {
          duration: 10000,
        });
        this.router.navigateByUrl('/home');
      })
      .catch(err => {
        console.log(err);
      });
  }

}
