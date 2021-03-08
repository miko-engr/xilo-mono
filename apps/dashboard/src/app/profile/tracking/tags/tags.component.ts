import { Component, OnInit } from '@angular/core';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../services/company.service';
import { LogService } from '../../../services/log.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css', '../../business/business.component.css']
})
export class TagsComponent implements OnInit {
    company = new Company();
    newTag = null;
    addingTag = false;
    editingTag = false;
    selectedIndex = null;
    oldTags = [];
    tagsRetrieved = false;
    loading = false;

    constructor(
        private companyService: CompanyService,
        private logService: LogService,
    ) {}

    ngOnInit() {
        this.getCompany();
    }

    addNewTag() {
        if (!this.company.tags || this.company.tags.length < 1) {
            this.company.tags = [];
        }
        this.company.tags.push(this.newTag);
    }

    deleteTag() {
        if (confirm('Are you sure you want to remove this tag?')) {
            this.company.tags.splice(this.selectedIndex, 1);
            this.upsertTag('Deleted');
        }
    }

    upsertTag(call: string) {
        this.loading = true;
        if (call === 'Created') {
            this.addNewTag();
        }
        this.companyService.patch(this.company)
        .subscribe(company => {
            this.logService.success(`Tag ${call} Successfully`);
            this.resetTags(call);
        }, error => {
            this.logService.console(error, true);
        });
    }

    getCompany() {
        this.loading = true;
        this.companyService.get()
        .subscribe(company => {
            this.company = company['obj'];
            this.oldTags = this.company.tags;
            this.tagsRetrieved = true;
            this.loading = false;
        }, error => {
            this.logService.console(error, true);
            this.loading = false;
        });

    }

    resetTags(call: string) {
        this.addingTag = false;
        this.editingTag = false;
        this.selectedIndex = null;
        this.newTag = null;
        if (call === 'Deleted' || call === 'Updated' || call === 'Created') {
            this.oldTags = this.company.tags;
        } else {
            this.company.tags = this.oldTags;
        }
        this.loading = false;
    }

    styleTabs(style: boolean) {
        if (style === true) {
            return {'border-bottom': '4px solid #7c7fff', 'color': '#000'};
        }
    }

    styleGroups() {
        return {'margin-bottom': '37px'};
    }

}
