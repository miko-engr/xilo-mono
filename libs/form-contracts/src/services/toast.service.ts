import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackBarComponent } from '../templates/icon-snack-bar/icon-snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message) {
    this.snackBar.openFromComponent(IconSnackBarComponent, {
      data: {
        message: 'Success, ' + message,
        icon:'assets/toast-icons/success-msg.svg'
      },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: ['success-snackbar'],
       duration: 2000,
    })
  }

  
  showError(message) {
    this.snackBar.openFromComponent(IconSnackBarComponent, {
      data: {
        message: 'Error, ' + message,
        icon:'assets/toast-icons/error-msg.svg'
      },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: ['error-snackbar'],
       duration: 2000,   
    });
  }

  showWarn(message) {
    this.snackBar.openFromComponent(IconSnackBarComponent, {
      data: {
        message: 'Warn, ' + message,
        icon:'assets/toast-icons/warn-msg.svg'
      },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: ['warn-snackbar'],
       duration: 2000,
    });
  }

  showMessage(message) {
    this.snackBar.openFromComponent(IconSnackBarComponent, {
      data: {
        message: message,
        icon:'assets/toast-icons/warn-msg.svg'
      },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: ['message-snackbar'],
       duration: 2000,
    });
  }

}
