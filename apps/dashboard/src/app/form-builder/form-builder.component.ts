import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Company } from '../models/company.model';
import { Observable } from 'rxjs/internal/Observable';
import { CompanyService } from '../services/company.service';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-form-builder-root',
  templateUrl: './form-builder.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./form-builder.component.scss'],
})
export class FormBuilderMainComponent implements OnInit {
  company$: Observable<Company>;

  constructor(
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.getCompany();
  }

  getCompany() {
    this.company$ = this.companyService.get()
                    .pipe(map( res => res['obj']));
  }

}
