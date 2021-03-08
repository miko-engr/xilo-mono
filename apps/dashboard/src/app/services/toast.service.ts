import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackBarComponent } from '../icon-snack-bar/icon-snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message, options?) {
    this.snackBar.openFromComponent(IconSnackBarComponent, {
      data: {
        message: message,
        icon:'assets/toast-icons/success-msg.svg',
        ...options
      },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: ['success-snackbar'],
       duration: (options && options.duration) || 2000,
    })
  }
  
  showError(message, options?) {
    this.snackBar.openFromComponent(IconSnackBarComponent, {
      data: {
        message: 'Error, ' + message,
        icon:'assets/toast-icons/error-msg.svg',
        ...options
      },
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: ['error-snackbar'],
      duration: options?.duration || 2000,
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
