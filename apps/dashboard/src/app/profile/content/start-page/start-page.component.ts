// import {Component, OnInit} from '@angular/core';
// import { AlertControllerService } from '../../../services/alert.service';
// import {MatTableDataSource} from '@angular/material/dialog';
// import { StartPage } from '../../../models/start-page';
// import { StartPageService } from '../../../services/start-page.service';
// import { CompanyService } from '../../../services/company.service';
// import { LogService } from '../../../services/log.service';
// import { Company } from '../../../models/company.model';

// @Component({
//     selector: 'app-content-start-page',
//     templateUrl: './start-page.component.html',
//     styleUrls: ['./start-page.component.css']
// })
// export class ContentStartPagesComponent implements OnInit {

//     editingStartPage = new StartPage(null, null, null);
//     addingStartPage = new StartPage(null, null, null);
//     startPages: StartPage[] = [];
//     startPage: StartPage = new StartPage(null, null, null);
//     newStartPage: StartPage = new StartPage(null, null, null, null, null, null);
//     dataSource = new MatTableDataSource();
//     startPagesRetrieved = false;
//     company;
//     companyRetrived = false;

//     columnsToDisplay = ['id', 'headerText', 'formType'];

//     constructor(
//         private alertService: AlertControllerService,
//         private companyService: CompanyService,
//         private logService: LogService,
//         private startPageService: StartPageService
//     ) { }

//     ngOnInit() {
//         //this.dataSource.paginator = this.paginator;
//         this.getCompanyData();
//     }

//     // Deletes an startPage and removes from current array of startPages
//     deleteStartPage() {
//       if (confirm('Are you sure you want to delete this page?')) {
//         this.startPageService.delete(this.startPage)
//             .subscribe(page => {
//                 this.startPages.splice(this.startPages.indexOf(this.startPage), 0);
//                 this.resetStartPage();
//                 this.alertService.success('StartPage Removed Successfully');
//                 this.dataSource.data = this.startPages;
//             }, error => {
//                 this.logService.console(error, true);
//             });
//       }
//     }

//     getCompanyData() {
//         this.company = new Company(null);
//         this.companyService.get()
//             .subscribe(company => {
//                 this.company = company['obj'];
//                 this.companyRetrived = true;
//                 this.getStartPages();
//             }, error =>  {
//                 this.logService.console(error, true);
//             });
//     }

//     getStartPageById(startPage) {
//         this.startPageService.get(startPage)
//             .subscribe(startPage => {
//                 this.startPage = startPage['obj'];
//             }, error => {
//                 this.logService.console(error, false);
//             });
//     }

//     getStartPages() {
//         this.startPageService.get()
//             .subscribe(startPages => {
//                 this.startPages = startPages['obj'];
//                 this.dataSource.data = this.startPages;
//                 this.startPagesRetrieved = true;
//             }, error => {
//                 this.logService.console(error, true);
//             });
//     }

//     resetStartPage() {
//         if (this.startPage.id !== null) {
//             this.startPage = new StartPage(null);
//         } else if (this.newStartPage.headerText !== null) {
//             this.newStartPage = new StartPage(null, null);
//         }
//     }

//     updateStartPage() {
//         if (this.startPage.id !== null) {
//             if (this.startPage.headerText === null) {
//                 this.alertService.warn('Not enough information filled!');
//             } else {
//                 this.startPageService.patch(this.startPage)
//                     .subscribe(startPage => {
//                         this.startPages[this.startPages.indexOf(this.startPage)] = startPage['obj'];
//                         this.alertService.success('Page Updated Successfully');
//                         this.dataSource.data = this.startPages;
//                         this.resetStartPage();
//                     }, error => {
//                         this.logService.console(error, true);
//                     });
//             }
//         } else if (this.newStartPage.headerText !== null) {
//             this.newStartPage.companyStartPageId = this.company.id;
//             this.startPageService.post(this.newStartPage)
//                 .subscribe(startPage => {
//                     this.startPages.push(startPage['obj']);
//                     this.resetStartPage();
//                     this.alertService.success('New Start Page Created Successfully');
//                     this.dataSource.data = this.startPages;
//                 }, error => {
//                     this.logService.console(error, true);
//                 });
//         }
//     }

//     styleGroups() {
//         return {'margin-bottom': '37px'};
//     }


// }
