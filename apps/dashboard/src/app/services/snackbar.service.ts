import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService {

  constructor(public snackbar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 202000,
      verticalPosition: 'top',
      panelClass: ['blue-snackbar']
    });
  }
}
