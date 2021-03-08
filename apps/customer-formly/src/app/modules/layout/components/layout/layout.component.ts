import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { takeUntil, take } from 'rxjs/operators';
import { Theme, Company } from '../../../../../app/modules/forms/models';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  companyDetails: Company;
  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    if (this.queryParams && this.queryParams.companyId) {
      this.getCompanyById(this.queryParams.companyId);
    }
    this.setTheme({
      'brand-color': '#6e71ff',
      'brand-color-light': '#6e71ff' + '33',
      'secondary-color': '#23d6c8',
      'hover-color': '#E5E5FB;',
      'secondary-color-light': '#23d6c8' + '33'
    });
  }
  private setTheme(theme: Theme) {
    Object.keys(theme).forEach(k =>
      document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  }
  getCompanyById(id) {
    this.companyService.getCompanyDetailsById(id).subscribe();

    this.companyService.companyDetails.subscribe((company: Company) => {
      this.companyDetails = company;
      this.setTheme({
        'brand-color': company.brandColor || '#6e71ff',
        'brand-color-light': (company.brandColor || '#6e71ff') + '33',
        'hover-color': company.brandColor || '#E5E5FB',
        'secondary-color': company.brandSecondaryColor || '#23d6c8',
        'secondary-color-light': company.brandSecondaryColor || '#23d6c8' + '33'
      });
    });
  }
}
