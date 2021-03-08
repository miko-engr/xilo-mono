import {Component, OnInit} from '@angular/core';
import { TemplateService } from '../../../services/template.service';
import { Template } from '../../../models/template.model';
import { Observable } from 'rxjs';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';
import { LogService } from '../../../services/log.service';

@Component({
    selector: 'app-automation-texts',
    templateUrl: './texts.component.html',
    styleUrls: ['../automation.component.css']
})
export class AutomationTextsComponent implements OnInit {
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
        this.templates$ = this.templateService.getByCompany('text');
        this.getCompany();
    }

    addText(){
        this.add = true;
        this.template = new Template(null);
    }

    addTemplate(template: Template) {
        if (!this.template.title || !this.template.body) {
            return this.logService.error('All fields are required');
        }
        template.isText = true;
        this.templateService.post(template)
            .subscribe(data => {
                this.templates$ = this.templateService.getByCompany('text');
                this.logService.success('Template Added Successfully');
                this.resetForm();
            }, error => {
                this.logService.console(error, true);
            });
    }

    deleteTemplate(template: Template) {
        if (confirm('Ae you sure you want to delete this text template?')) {
            this.templateService.delete(template)
            .subscribe(data => {
                this.templates$ = this.templateService.getByCompany('text');
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
        if (!this.template.title || !this.template.body) {
            return this.logService.error('All fields are required');
        }
        this.templateService.patch(template)
            .subscribe(updatedTemplate => {
                this.templates$ = this.templateService.getByCompany('text');
                this.logService.success('Template Updated Successfully');
                this.resetForm();
            }, error => {
                this.logService.console(error, true);
            });
    }

}
