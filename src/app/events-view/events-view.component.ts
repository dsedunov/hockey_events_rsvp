import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

export interface Color {
  value: string;
  viewValue: string;
}


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
  user = null;
  colorSelected = '';

  colors: Color[] = [
    { value: 'Черный', viewValue: 'Черный' },
    { value: 'Белый', viewValue: 'Белый' }
  ];

  constructor(
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public eventFormBuilder: FormBuilder,
    private firebaseAuth: AngularFireAuth,
    private snackBar: MatSnackBar,
  ) {
  }

   async ngOnInit() {

    const usersRef = this.afs.collection('users').doc(((await this.firebaseAuth.currentUser).email).toLowerCase()).ref;
    usersRef.get()
      .then(async doc => {
        if (doc.exists) {
          this.user = doc.data();
          this.user.uid = (await this.firebaseAuth.currentUser).uid;
          const userId = this.user.uid;
        } else {
          console.log('No such document!');
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.changedEvent = JSON.parse(params.param);
      console.log(this.changedEvent);
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
        // const league = this.changedEvent.players && this.user.league.map(player => player.league);


        this.noVotedUsers = users
          .filter(user => {
            return (whiteListArr.indexOf(user.uid) !== -1 && accptedUID.indexOf(user.uid) === -1 && rejectedUID.indexOf(user.uid) === -1);
          })

          // .filter(user => {
          //   return (whiteListArr.indexOf(user.league) !== -1 && league.indexOf(user.league)); })


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
