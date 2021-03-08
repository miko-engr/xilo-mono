import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../services';
import { Form } from '../../models';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';
import { BASE_URL, V1_FORM_URL } from '../../../../../app/constants';

@Component({
  selector: 'app-list-all-forms',
  templateUrl: './list-all-forms.component.html',
  styleUrls: ['./list-all-forms.component.scss'],
  animations: [
    trigger('FadingSection', [
      state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(
        ':enter',
        animate(
          '800ms ease-out',
          keyframes([
            style({ opacity: 0, transform: 'translateY(-20px)', offset: 0 }),
            style({ opacity: 0.5, transform: 'translateY(10px)', offset: 0.6 }),
            style({ opacity: 0.7, transform: 'translateY(2px)', offset: 0.8 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
          ])
        )
      )
    ])
  ]
})
export class ListAllFormsComponent implements OnInit {
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  listOfForms: Form[];
  loaded = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    if (this.queryParams && this.queryParams.companyId) {
      this.getFormListById(this.queryParams.companyId);
    }
  }
  handleFormOptionClick(form: Form) {
    if (form.isV2Form) {
      this.router.navigate(['/form/start'], {
        queryParams: { ...this.queryParams, formId: form.id }
      });
    } else {
      this.handleNavigateToV1Form(form);
    }
  }
  handleNavigateToV1Form(form: Form) {
    let url = V1_FORM_URL;
    if (form.isSimpleForm) {
      url += `simple/form`;
    } else {
        url += 'form/page/start';
    }
    url += `?companyId=${this.queryParams.companyId}&formId=${form.id}`;
    for (const key in this.queryParams) {
      if (key !== 'companyId' && key !== 'formId') {
        url += `&${key}=${this.queryParams[key]}`;
      }
    }
    window.location.href = url;
  }
  getFormListById(id) {
    this.formService.getFormListById(id).subscribe(data => {
      this.listOfForms = data;
      this.loaded = true;
    });
  }
}
