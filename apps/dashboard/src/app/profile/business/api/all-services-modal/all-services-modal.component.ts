import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-all-services-modal',
  templateUrl: './all-services-modal.component.html',
  styleUrls: ['../../business.component.css']
})
export class AllServicesModalComponent implements OnInit {
  integrationtype = "All Service";
  apiServiceList: any[] = [];
  searchText: string = '';
  list : any[] = [];
  constructor(
    public dialogRef: MatDialogRef<AllServicesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.apiServiceList = this.data;
    this.apiServiceList.sort((a,b) => a.name.localeCompare(b.name));
    this.list = this.data;
  }

  close() {
    this.dialogRef.close('data')
  }

  search(text) {
    if (text) {
      this.apiServiceList = this.list.filter(item => item.name && item.name.toLowerCase().indexOf(text.toLowerCase()) > -1)
    } else {
      this.apiServiceList = this.list;
    }
  }

}
