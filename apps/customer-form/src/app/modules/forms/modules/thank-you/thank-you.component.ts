import { Component, OnInit } from '@angular/core';
import { PageService, FormService, ClientService } from '../../services';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormCompletedPageResponse, Form, Company } from '../../models';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';
import { CompanyService } from '../../../layout/services/company.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
  host: { class: 'container' },
  animations: [
    trigger('PageAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(0px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(
        ':enter',
        animate(
          '300ms ease-in',
          keyframes([
            style({ opacity: 0, transform: 'translateY(0px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
          ])
        )
      ),
      transition(':leave', animate('100ms ease-out'))
    ])
  ]
})
export class ThankYouComponent implements OnInit {
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  pageData: FormCompletedPageResponse;
  forms: Form[] = [];
  company: Company
  loaded: boolean;
  selectedForm;
  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private formService: FormService,
    private clientService: ClientService,
    private companyService: CompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const { formId, companyId, formType } = this.queryParams;
    this.loaded = false;
    this.pageService
      .getFormCompletedPage(formId, formType, companyId)
      .subscribe((page: FormCompletedPageResponse) => {
        this.pageData = page;
        this.loaded = true;
        if (page.hasOtherOffers && page.bundleFormIds) {
          page.bundleFormIds.forEach(id => {
            this.formService.getById(companyId, id).subscribe(form => {
              this.forms.push(form);
            });
          });
        }
      });
    const clientId = localStorage.getItem('clientId');
    const formStatus = localStorage.getItem('formStatus');
    if (!formStatus || formStatus === 'Filling') {
      localStorage.setItem('formStatus', 'Finished');
      this.clientService
          .upsertAll(
            {
              updates: [
                {
                  objModel: 'Client',
                  object: { id: clientId, formStatus: 'Finished' }
                }
              ]
            },
            this.queryParams.companyId,
            false
          )
          .subscribe();
    }
    this.getFormById(companyId, formId);
  }
  handleClick() {
    // localStorage.clear();
    delete this.queryParams.questionnum;
    delete this.queryParams.subindex;
    delete this.queryParams.hasReturnToFormSelectionPage;
    this.router.navigate(['/form/list-all-forms'], {
      queryParams: this.queryParams
    });
  }

  getFormById(companyId, formId) {
    this.formService.getById(companyId, formId).subscribe(form => {
      this.selectedForm = form;
    });
  }

}
