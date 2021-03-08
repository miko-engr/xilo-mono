import { Component, OnInit, Input } from '@angular/core';
import { Company, FormViewService } from '@xilo-mono/form-contracts';
import { 
  flattenFormSections, 
  flattenFormQuestions, 
  getArrayOfSectionQuestions 
} from '@xilo-mono/form-helper';

@Component({
  selector: 'xilo-mono-intake-form-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class IntakeFormSummaryComponent implements OnInit {
  constructor(
    public formViewService: FormViewService
  ) {}
  @Input() companyDetails: Company;
  @Input() fields: any[];
  sectionQuestions = {};
  activeSectionDropdown = null;
  activeSection = null;

  ngOnInit(): void {
    setTimeout(() => {
      this.fields = flattenFormSections(this.fields);
      this.sectionQuestions = getArrayOfSectionQuestions(this.fields);
    }, 2000);
    this.formViewService.activeState
    .subscribe(key => {
      this.activeSection = key;
    })
  }

  activateSectionDropdown(key: string) {
    this.activeSectionDropdown = key;
  }

  deactivateSectionDropdown() {
    this.activeSectionDropdown = null;
  }

  styleActiveSectionDropdown(key: string) {
    if (this.sectionDropdownIsActive(key)) {
      return { height: '100%', padding: '0 16px 8px 16px' }
    }
  }

  styleActiveDropdownCaret(key: string) {
    if (this.sectionDropdownIsActive(key)) {
      return { transform: 'rotate(180deg)' }
    }
  }

  sectionDropdownIsActive(key: string) {
    return this.activeSectionDropdown === key;
  }

  sectionIsActive(first: boolean, key: string) {
    if (!this.activeSection && first) {
      return true;
    } else if (this.activeSection === key) {
      return true;
    }
  }

  scrollToSection(key: string) {
    this.formViewService.scrollIntoView(key);
    //this.activeSection = key;
  }

}
