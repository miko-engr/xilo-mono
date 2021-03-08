import { Component, OnInit, Input } from '@angular/core';
import { Company, Form } from '../../../../../app/modules/forms/models';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor() {}
  @Input() companyDetails: Company;
  @Input() formDetails: Form;
  ngOnInit(): void {}

  setBannerStyle() {
    let styles;
    if (this.formDetails?.showBanner) {
      styles = {
        'background-image': `url(${this.formDetails?.banner || this.companyDetails?.logo})`,
        'background-repeat': 'no-repeat',
        'background-size': '100% 100%',
        'background-position': 'center'
      };
    }
    return styles || {};
  }
}
