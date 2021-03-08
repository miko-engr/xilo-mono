import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { LoaderModalService } from '../../../services/loader-modal.service';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';
import { Apis } from '../../../utils/apis-list';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['../company-info/company-info.component.scss']
})
export class TeamMembersComponent implements OnInit {

  sendInvitationForm: FormGroup;
  company = new Company(null);
  isEzlynx: Boolean = false;
  emailRegExp: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private loaderModalService: LoaderModalService,
    private companyService: CompanyService,
    private toastService:ToastService
  ) { }

  ngOnInit(): void {
    this.getCompany();
    this.createForm();
  }

  getCompany() {
    this.loaderModalService.openModalLoader('');
    this.companyService.get().subscribe(company => {
      this.company = company['obj'];
      this.prepareApiIntegration();
      this.loaderModalService.closeModal();
    }, (error) =>{ this.toastService.showError(error.error.message),
      this.loaderModalService.closeModal();
    });
  }

  prepareApiIntegration() {
    const apisList = new Apis().prepareApisList(this.company);
    this.isEzlynx = false;
    apisList.filter((item) => {
      if ((item.key === 'hasCommercialEzlynxIntegration' || item.key === 'hasEzlynxIntegration') && (item.values === true || item.values === 'true')) {
        this.isEzlynx = true;
      }
    });
  }

  createForm() {
    this.sendInvitationForm = this.fb.group({
      firstName: ['', [Validators.pattern(/^\S(.*\S)/),Validators.required]],
      lastName: ['', [Validators.pattern(/^\S(.*\S)/),Validators.required]],
      contactForm: ['', [Validators.required]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailRegExp)])],
      userType: ['', [Validators.pattern(/^\S(.*\S)/),Validators.required]],
      vendorUsername: ['']
    });
  }

  sendInvitation() {
    if (this.sendInvitationForm.invalid) {
      this.sendInvitationForm.markAllAsTouched();
      return false;
    } else {
      const data = this.sendInvitationForm.value;
      this.userService.sendInvitationEmail(data).subscribe((res: any) => {
        this.toastService.showSuccess('An invitation to ' + data.email + ' has been sent');
        this.sendInvitationForm.reset();
        sessionStorage.clear();
        this.sendInvitationForm.markAsUntouched();
      }, error => {
        this.toastService.showError(error.error.error.message);
    });
    }
  }

}
