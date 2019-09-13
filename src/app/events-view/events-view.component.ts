import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  user = null;
  form: FormGroup;
  marks: MarkDTO[] = [
    new MarkDTO({id: 1, name: 'test1', number: 1}),
    new MarkDTO({id: 2, name: 'test2', number: 2}),
    new MarkDTO({id: 3, name: 'test3', number: 3}),
    new MarkDTO({id: 4, name: 'test4', number: 4}),
  ];

  getSelectedLabel(): MarkDTO {
    return this.form.get('label').value;
  }

  constructor(
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public eventFormBuilder: FormBuilder,
    private firebaseAuth: AngularFireAuth,
    private snackBar: MatSnackBar
  ) { this.form = eventFormBuilder.group({
    label: []
  });
}

   ngOnInit() {

    const usersRef = this.afs.collection('users').doc((this.firebaseAuth.auth.currentUser.email).toLowerCase()).ref;
    usersRef.get()
      .then(doc => {
        if (doc.exists) {
          this.user = doc.data();
          this.user.uid = this.firebaseAuth.auth.currentUser.uid;
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
        // const leagueUID = this.changedEvent.players.reject && this.changedEvent.players.league.map(player => player.uid);

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

class MarkDTO {
  id: number;
  name: string;
  number: number;
  constructor(mark?: any) {
    this.id = mark && mark.id || null;
    this.name = mark && mark.name || null;
    this.number = mark && mark.number || null;
  }
  get color(): string {
    let color = '';
    switch (this.number) {
      case 1: color = 'lightgray'; break;
      case 2: color = 'lightblue'; break;
      case 3: color = 'orange'; break;
      case 4: color = 'yellow'; break;
      case 5: color = 'green'; break;
      case 6: color = 'purple'; break;
      case 7: color = 'gray'; break;
      case 8: color = 'blue'; break;
      case 9: color = 'red'; break;
      case 10: color = 'black'; break;
    }
    return color;
  }
}
