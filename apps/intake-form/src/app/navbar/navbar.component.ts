import { Component, OnInit, Input } from '@angular/core';
import { Company, FormViewService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'xilo-mono-intake-form-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class IntakeFormNavbarComponent implements OnInit {
  @Input() companyDetails: Company;
  constructor(
    public formViewService: FormViewService
  ) {}
  ngOnInit(): void {}

  onSubmit() {
    this.formViewService.onSubmitForm(true);
  }

}
