import { Component, OnInit } from '@angular/core';
import { FormBuilderService, FormViewService } from '@xilo-mono/form-contracts';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-form-builder-component-pdf-question-tree',
  templateUrl: './question-tree.component.html',
  styleUrls: ['./question-tree.component.scss'],
})
export class PdfQuestionTreeComponent implements OnInit {
  formId: string;
  form: any;
  // TODO: add types
  formData: any[];

  constructor(
    private route: ActivatedRoute,
    private formViewService: FormViewService,
    private formBuilderService: FormBuilderService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const formId = params.id;
      this.getFormTemplateByFormId(formId);
    });
  }

  private getFormTemplateByFormId(formId: string): void {
    this.formId = formId;
    // this.formViewService.getForm(formId).subscribe(
    this.formViewService.getForm(formId).subscribe(
      (successResponse) => {
        this.form = successResponse;
        this.formBuilderService.setForm(successResponse)
      },
      (errorResponse) => {
        this.handleFormTemplateDataError(errorResponse);
      }
    );
  }

  private handleFormTemplateDataError(errorResponse): void {
    console.error(
      `There was an error while requesting Form Template data for formId ${this.formId}`,
      errorResponse
    );
  }
}
