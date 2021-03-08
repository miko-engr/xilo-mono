import { Component, OnInit, Input } from '@angular/core';
import { Company } from '../../../../../app/modules/forms/models';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor() {}
  @Input() companyDetails: Company;
  ngOnInit(): void {}
}
