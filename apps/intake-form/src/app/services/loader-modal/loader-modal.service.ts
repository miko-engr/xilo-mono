import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoaderModalComponent } from './loader-modal.component';

@Injectable()
export class LoaderModalService {
  @Output() closeDialog: EventEmitter<any> = new EventEmitter();
  dialogRef: MatDialogRef<any>;
  constructor(private dialog: MatDialog) { }

  openModalLoader(name: string) {
    console.log('Modal hit');
    this.dialogRef = this.dialog.open(LoaderModalComponent, {
      width: '350px',
      height: '200px',
      panelClass: 'dialog',
      data: name || '',
      disableClose: false
    });
    this.dialogRef.afterClosed().subscribe(async(results) => {
    });
  }

  closeModal() {
    this.dialogRef.close();
    this.dialogRef = null;
  }
}
