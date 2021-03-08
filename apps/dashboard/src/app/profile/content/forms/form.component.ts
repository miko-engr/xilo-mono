import {Component, OnInit} from '@angular/core';
import {CompanyService} from '../../../services/company.service';
import {LogService} from '../../../services/log.service';
import {Company} from '../../../models/company.model';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-content-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class ContentFormsComponent implements OnInit {
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  company = new Company(null);
  companyRetrieved = false;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    public dialog: MatDialog,
    private logService: LogService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getCompany();
  }

  getCompany() {
    this.loading = true;
    this.company = new Company(null);
    this.companyService.get()
      .subscribe(company => {
        this.company = company['obj'];
        this.companyRetrieved = true;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.logService.console(error, true);
      });
  }

  isLinkActive(type: string): boolean {
    if (type === 'both') {
      return (this.router.url.includes('page') || this.router.url.includes('question'));
    } else if (type === 'page') {
      return this.router.url.includes('page');
    } else if (type === 'question') {
      return (this.route.snapshot.queryParams['qi']);
    }
  }

}
