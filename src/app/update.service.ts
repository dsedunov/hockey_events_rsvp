import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class UpdateService {
  constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
    // Subscribe to versionUpdates to listen for new update notifications
    this.swUpdate.versionUpdates.subscribe(() => {
      this.showUpdateSnackbar();
    });

    // Check for available updates immediately
    this.checkForUpdates();
  }

  // Method to check for updates
  private async checkForUpdates(): Promise<void> {
    try {
      const available = await this.swUpdate.checkForUpdate();
      if (available) {
        this.showUpdateSnackbar();
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }

  // Method to show a snackbar notification for the update
  private showUpdateSnackbar(): void {
    const snack = this.snackbar.open('Новое обновление', 'Вперед!');

    snack
      .onAction()
      .subscribe(() => {
        this.activateUpdate();
      });

    snack._dismissAfter(16000); // You can remove this line if you prefer to use the duration option in MatSnackBar
  }

  // Method to activate the update
  private async activateUpdate(): Promise<void> {
    try {
      const activated = await this.swUpdate.activateUpdate();
      if (activated) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error activating update:', error);
    }
  }
}