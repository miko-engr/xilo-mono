import {Component, OnInit} from '@angular/core';
import { LogService } from '../../../services/log.service';
import { TemplateService } from '../../../services/template.service';
import { Observable } from 'rxjs';
import { Template } from '../../../models/template.model';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';

@Component({
    selector: 'app-automation-emails',
    templateUrl: './emails.component.html',
    styleUrls: ['../automation.component.css']
})
export class AutomationEmailsComponent implements OnInit {

    company: Company = new Company(null);
    
    add:boolean = false;
    edit:boolean = false;

    template = new Template(null);
    templates$: Observable<Template[]>

    constructor(
        private companyService: CompanyService,
        private logService: LogService,
        private templateService: TemplateService
    ) { }

    ngOnInit() {
        this.templates$ = this.templateService.getByCompany('email');
        this.getCompany();
    }

    addEmail(){
        this.add = true;
        this.template = new Template(null);
    }

    addTemplate(template: Template) {
        if (!this.template.title || !this.template.subject || !this.template.body) {
            return this.logService.error('All fields are required');
         }
         template.isEmail = true;
         this.templateService.post(template)
             .subscribe(data => {
                 this.templates$ = this.templateService.getByCompany('email');
                 this.logService.success('Template Added Successfully');
                 this.resetForm();
             }, error => {
                 this.logService.console(error, true);
             });
    }

    deleteTemplate(template: Template) {
        if (confirm('Are you sure you want to delete this email template?')) {
            this.templateService.delete(template)
            .subscribe(data => {
                this.templates$ = this.templateService.getByCompany('email');
                this.logService.success('Template Deleted Successfully');
                this.resetForm();
            }, error => {
                this.logService.console(error, true);
            });
        }
    }

    getCompany() {
        this.companyService.get()
            .subscribe(company => {
                this.company = company['obj'];
            }, error => {
                this.logService.console(error, true);
            })
    }

    getTemplate(template) {
        this.templateService.get(template)
            .subscribe(template => {
                this.template = template['obj'];
                this.edit = true;
            }, error => {
                this.logService.console(error, true);
            });
    }

    resetForm() {
        this.add = false;
        this.edit = false;
    }

    updateTemplate(template: Template) {
        if (!this.template.title || !this.template.subject || !this.template.body) {
            return this.logService.error('All fields are required');
         }
         this.templateService.patch(template)
             .subscribe(updatedTemplate => {
                 this.templates$ = this.templateService.getByCompany('email');
                 this.logService.success('Template Updated Successfully');
                 this.resetForm();
             }, error => {
                 this.logService.console(error, true);
             });
    }

}
