import { Component, OnInit, ViewChild } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../services/company.service';
import { AlertControllerService } from '../../../services/alert.service';
import { Form } from '../../../models/form.model';
import { Router } from '@angular/router';
import { LoaderModalService } from '../../../services/loader-modal.service';
import { FormsComponent } from '../forms/forms.component';
import { SignupFlowService } from '../../../services/signup-flow.service';
import { formatAddress, formatPhoneNumber, formatTonumber } from '../../../utils/utils';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss', '../signup.component.scss']
})
export class CompanyInfoComponent implements OnInit {
  currentHeader = null;
  company = new Company(null);
  currentStep = null;
  isCompleted = false;
  newForm = new Form();
  isValid: Boolean = true;
  action: string;
  isNext: Boolean = false;
  allHeader = [
    {
      logo: 'assets/signup-flow/company info_small.svg',
      heading: 'Agency Information',
      info: 'Add some details about your agency',
      step: 1,
      value: 20,
      isLastStep: false
    },
    {
      logo: 'assets/signup-flow/branding.svg',
      heading: 'Brand Information',
      info: 'Customize the branding on your forms',
      step: 2,
      value: 40,
      isLastStep: false
    },
    {
      logo: 'assets/signup-flow/team members.svg',
      heading: 'Team Members',
      info: 'Add your agents and other admins to XILO',
      step: 3,
      value: 60,
      isLastStep: false
    },
    {
      logo: 'assets/signup-flow/form_feedback.svg',
      heading: 'Select forms to start with',
      info: 'Choose which forms you want to start with',
      step: 4,
      value: 80,
      isLastStep: false
    },
    {
      logo: 'assets/signup-flow/integrations.svg',
      heading: 'Choose your integrations',
      info: 'Select the integrations you will be connecting your forms to',
      step: 5,
      value: 95,
      isLastStep: true
    },
  ];
  @ViewChild(FormsComponent, {
    static: false
  }) formsComponent: FormsComponent;


  constructor(
    private companyService: CompanyService,
    private signupFlowService: SignupFlowService,
    private router: Router,
    private loaderModalService: LoaderModalService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.currentHeader = this.allHeader[0];
    this.getCompany();
  }

  public handleAddressChange(address: Address) {
    const {
      city,
      state,
      county,
      fullAddress,
      streetAddress,
      streetName,
      streetNumber,
      zipCode,
    } = formatAddress(address);
    if(city && state && county && streetAddress && streetName && streetNumber && zipCode){
      this.company.city = city;
      this.company.state = state;
      this.company.county = county;
      this.company.fullAddress = fullAddress;
      this.company.streetAddress = streetAddress;
      this.company.streetName = streetName;
      this.company.streetNumber = streetNumber;
      this.company.zipCode = zipCode;
    } else {
      this.company.fullAddress = null
      this.toastService.showError('Invalid address');
    }
  }

  back(currentStep) {
    this.isNext = false;
    if (currentStep !== 1) {
      const step = currentStep - 2;
      this.currentHeader = this.allHeader[step];
      this.setHeaderInfo();
    }
  }
  async next(currentStep) {
    this.isNext = true;
    const data = this.currentHeader;
    this.isValid = await this.checkValidation(data);
    if (!this.isValid) {
      return false;
    }
    this.currentStep = currentStep;
    this.updateAction(currentStep);
    if (currentStep === 4) {
     this.formsComponent.createdSelectedForms(currentStep);
    }
  }

  isDisabled() {
    const valid = this.checkValidation(this.currentHeader);
    if (valid) {
      return false;
    } else {
      return true;
    }
  }

  updateAction(currentStep) {
    if (currentStep === 1) {
      this.action = 'updateCompany';
      this.updateCompany();
    } else if (currentStep === 2) {
      this.action = 'updateBrand';
      this.signupFlowService.updateCurrentStep(this.action);
    } else if (currentStep === 6) {
      this.action = 'updateApis';
      this.signupFlowService.updateCurrentStep(this.action);
    } else if (currentStep === 3 || currentStep === 5) {
      this.signupFlowService.isChanged = false;
      this.currentHeader = this.allHeader[this.currentStep];
      this.setHeaderInfo();
    }
  }

  navigateToFeedback(event){
    if (event !== 5) {
      this.currentHeader = this.allHeader[event];
      this.setHeaderInfo();
    }
  }

  checkValidation(data) {
    let isValid = true;
    if (data.step === 1) {
      this.company.name = this.company.name && this.company.name.trim();
      this.company.fullAddress = this.company.fullAddress && this.company.fullAddress.trim();
      const isInvalidCompany = !this.company.name || !this.company.contactNumber || !this.company.fullAddress;
      const isInvalidContantNumber = this.company.contactNumber && this.company.contactNumber.length < 10;
      if (isInvalidCompany || isInvalidContantNumber ) isValid = false;
    }
    return isValid;
  }

  getCompany() {
    this.loaderModalService.openModalLoader('');
    this.companyService.get().subscribe(company => {
    this.company = company['obj'];
    this.loaderModalService.closeModal();
    this.getHeaderInfo();
    }, (error) =>{ this.toastService.showError(error.error.message),
      this.loaderModalService.closeModal();
    });
  }

  async updateCompany() {
    await this.updateAddress();
    this.loaderModalService.openModalLoader(null);
    this.companyService.patch(this.company).subscribe(updatedCompany => {
        this.signupFlowService.isChanged = false;
        this.loaderModalService.closeModal();
        this.currentHeader = this.allHeader[this.currentStep];
        this.setHeaderInfo();
      }, error => {
        this.loaderModalService.closeModal();
        this.toastService.showError(error.error.error.message);
    });
  }

  async updateAddress() {
    if (this.company.streetNumber && this.company.streetName) {
        this.company.streetAddress = `${this.company.streetNumber} ${this.company.streetName}` +
        (this.company.unit ? ` Unit ${this.company.unit},` : '');
        this.company.fullAddress = `${this.company.streetAddress} ${this.company.city}, ${this.company.state}, ${this.company.zipCode}`; ;
    }
    return null;
  }

  completeProfile() {
    this.signupFlowService.sendIntegrationActivationEmails({
      companyId: this.company.id,
    }).subscribe();
    this.signupFlowService.sendNewUserInfoEmailsToXILOTeam({
      companyId: this.company.id,
    }).subscribe();
    this.isCompleted = true;
    sessionStorage.clear();
    this.router.navigate(['/auth/signup-flow/success']);
  }

  brandInfoUpdated(event: any) {
    if (this.currentStep === 2 && this.isNext) {
      this.company = event;
      this.updateCompany();
    }
  }

  apisInfoUpdated(event: any) {
    if (this.currentStep === 3 && this.isNext) {
      this.company = event;
      this.updateCompany();
    }
  }

  isInputChange() {
    this.signupFlowService.isChanged = true;
  }

  goToDashboard() {
    this.router.navigate(['/profile/prospects'], { queryParams: 
      { 
        createdAt: '30',
        tour: 'onboard_and_table' 
      } 
    });
  }

  setHeaderInfo() {
    const currentHeader = JSON.stringify(this.currentHeader);
    sessionStorage.setItem('currentHeader', currentHeader);
  }

  getHeaderInfo() {
    const currentHeader = sessionStorage.getItem('currentHeader');
    if (currentHeader) {
      this.currentHeader = JSON.parse(currentHeader);
    } else {
      this.currentHeader = this.allHeader[0];
      this.setHeaderInfo();
    }
  }

}
