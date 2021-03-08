import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormViewService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'app-form-wizard-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class FormWizardNavComponent implements OnInit {

    constructor(
        private formViewService: FormViewService,
        private router: Router
    ) {}

    ngOnInit() {}
  
}
