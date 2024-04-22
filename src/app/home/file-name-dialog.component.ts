import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  template: `
    <form  [formGroup]="guestForm" >
      <h1 style="display: flex;
      align-content: center;
      justify-content: center;" mat-dialog-title>Добавить гостя</h1>
      <mat-dialog-content style="display: block;
      align-content: center;
      justify-content: space-around;
      margin: auto;">
        <mat-form-field  appearance="outline">
        <mat-label>Имя</mat-label>
          <input type='text' formControlName="name" matInput required>
        </mat-form-field>
        <mat-form-field   appearance="outline">
        <mat-select formControlName="role" required placeholder="Позиция">
        <mat-option value="Защитник">Защитник</mat-option>
        <mat-option value="Нападающий">Нападающий</mat-option>
        <mat-option value="Вратарь">Вратарь</mat-option>
      </mat-select>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions style="display: flex;
      align-content: center;
      justify-content: space-around;
      margin: 0px;">
        <button style="width: 45%;
        margin: 0;
        border: #dc8ea4 1px solid;
        border-radius: 4px;
        font-weight: 200;
        font-size: 16px;" mat-button type="button" (click)="dialogRef.close()">Отмена</button>
        <button style="width: 45%;
        margin: 0;
        background-color: #E98AA4;
        border-radius: 4px;
        font-weight: 200;
        font-size: 16px;" mat-button type="submit" (click)="addGuests()">Ок</button>
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
        players: [{ name: newGuestData.name, surname: 'Гость', role:newGuestData.role, status: 'accept' },
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
