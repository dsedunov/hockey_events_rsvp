import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class UpdateService {
  constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
    this.swUpdate.available.subscribe(evt => {
      const snack = this.snackbar.open('Новое обновление', 'Вперед!');

      snack
        .onAction()
        .subscribe(() => {
          window.location.reload();
        });

      snack._dismissAfter(
     16000);
    });
  }
}
