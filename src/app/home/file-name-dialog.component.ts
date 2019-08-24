import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  template: `
    <form [formGroup]="guestForm" >
      <h1 mat-dialog-title>Добавить гостя</h1>
      <mat-dialog-content>
        <mat-form-field>
          <input type='text' formControlName="name" matInput placeholder="Имя">
        </mat-form-field>
        <mat-form-field>
        <mat-select formControlName="role">
        <mat-option value="Защитник">Защитник</mat-option>
        <mat-option value="Нападающий">Нападающий</mat-option>
        <mat-option value="Вратарь">Вратарь</mat-option>
      </mat-select>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button type="submit" (click)="addGuests()">Ок</button>
        <button mat-button type="button" (click)="dialogRef.close()">Отмена</button>
      </mat-dialog-actions>
    </form>
  `
})
export class FileNameDialogComponent implements OnInit {

  form: FormGroup;
  changedEvent;

  constructor(
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FileNameDialogComponent>,
    private guestFormBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data,
    private snackBar: MatSnackBar
  ) {}

  guestForm = this.guestFormBuilder.group({
    name: [''],
    role: [''],
  });

  ngOnInit() {
    this.changedEvent=JSON.parse(this.data.event);
  }

  addGuests() {
    this.dialogRef.close();
    if (this.guestForm.status === 'VALID') {
      const newGuestData = this.guestForm.value;

      this.changedEvent = {
        ...this.changedEvent,
        gameDay: this.changedEvent.gameDayISO,
        players: [{ name: newGuestData.name, role:newGuestData.role, status: 'accept' },
         ...this.changedEvent.players.accept, ...this.changedEvent.players.reject]
      };
      delete this.changedEvent.gameDayISO;

      this.afs.collection('events').doc(this.changedEvent.id).set(this.changedEvent)
        .then(() => {
          this.snackBar.open('Гость успешно добавлен', 'ok', {
            duration: 10000,
          });
        })
        .catch(err => {
          console.log(err);
        });

    }
  }
}
