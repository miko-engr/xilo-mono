import { Component, OnInit } from '@angular/core';
import {AlertControllerService} from "../../../services/alert.service";
import { ApiService } from '../../../services/api.service';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../services/company.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import {UploadService} from "../../../services/upload.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['../business.component.css']
})
export class BrandingComponent implements OnInit {
  isUnsaved: Boolean = false;
  editInputs = true;
  fontList: any[] = [];
  company = new Company(null);
  tempcompany: any;
  loading = false;
  user = new User(null);
  agencyName: string;
  userRetrieved = false;
  disableSaveUser = false;
  editBrandColor = false;
  disableUploadLogo = false;

  myFormData: FormData;
  userFileUploaded = false;
  userFiles;
  brandColor = null;
  isInvalidCode = false;
  isBrandingUnsaved = false;

  constructor(
      private companyService: CompanyService,
      private userService: UserService,
      private alertService: AlertControllerService,
      private apiService: ApiService,
      private router: Router,
      private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.getFontList();
    this.getCompany();
  }

  getCompany() {
      this.company = new Company(null);
      this.tempcompany = null;
      this.loading = true;
      this.userService.get()
          .subscribe(user => {
              this.user = user['obj'];
              this.companyService.get()
                  .subscribe(company => {
                      this.loading = false;
                      this.tempcompany = JSON.parse(JSON.stringify(company));
                      this.setBrandingData(company);
                      this.userRetrieved = true;
                  }, error =>  {
                      this.loading = false;
                      
                      if (error) {
                          localStorage.clear();
                          this.router.navigate(['/auth/login']);
                      }
                      this.alertService.serverError(error.error.errorType, error.error.data);
                  });
          })
  }

  setBrandingData(company) {
    this.company = company['obj'];
    this.brandColor = this.company.brandColor;
    this.agencyName = (this.company.name !== null) ? this.company.name.replace(/\s+/g, '-') : '';
  }

  // Allows the company to edit inputs by clicking edit button
  onEditInputs() {
      this.editInputs = !this.editInputs;
  }

  styleGroups() {
      if (this.editInputs === true) {
          return {'margin-bottom': '37px'};
      }
  }

  resetInputs() {
      const data = JSON.parse(JSON.stringify(this.tempcompany));
      this.setBrandingData(data);
      this.isUnsaved = false;
      this.isBrandingUnsaved = false;
    //   this.editInputs = false;
      this.editBrandColor = false;
  }

  updateBrandColor() {
      if (confirm('This will update all of the form icon colors. Are you sure?')) {
        this.loading = true;
        this.disableSaveUser = true;
        this.companyService.updateBrandColor(this.company.brandColor)
        .subscribe(updated => {
            this.loading = false;
            // this.onEditInputs();
            this.disableSaveUser = false;
            this.editBrandColor = false;
            // this.editInputs = false;
            this.alertService.success('Brand color updated');
        }, error => {
            this.loading = false;
            this.disableSaveUser = false;
            this.alertService.serverError(error.error.errorType, error.error.data);
        })
      }
      this.loading = true;
  }

  updateCompany() {
      this.loading = true;
      this.disableSaveUser = true;
        this.companyService.patch(this.company)
            .subscribe(updatedCompany => {
                this.loading = false;
                // this.onEditInputs();
                this.disableSaveUser = false;
                this.editBrandColor = false;
                // this.editInputs = false;
                const data = {
                    obj: this.company,
                }
                this.tempcompany = JSON.parse(JSON.stringify(data));
                this.resetInputs()
                this.alertService.success('Profile Updated Successfully');
            }, error => {
                this.loading = false;
                this.disableSaveUser = false;
                this.alertService.serverError(error.error.errorType, error.error.data);
            });
  }

  postImage(files: File[], type: string) {
      this.loading = true;
      this.disableUploadLogo = true;
      this.uploadService.postImage(this.myFormData)
          .subscribe(file => {
              this.loading = false;
              const imagePath = 'https://s3-us-west-2.amazonaws.com/rent-z/' + file['obj'].file;
              this.company.logo = imagePath;
              this.userFileUploaded = true;
              this.disableUploadLogo = false;
              this.userFiles = null;
              this.updateCompany();
          }, error => {
              this.loading = false;
              this.disableUploadLogo = false;
              
              this.alertService.serverError(error.error.errorType, error.error.data);
          })
  }

    isUnsavedData(isBranding?) {
        this.isUnsaved = true;
        this.isBrandingUnsaved = isBranding;
    }

    onColorChange(event, type) {
      this.isUnsavedData();
      this.company[type] = event;
    }

  setInvalidCode(code) {
    this.isInvalidCode = code ? !code.startsWith('#') : false
  }
    //   fontlist
    getFontList() {
        const fontList = [
            "Arial, Helvetica, Sans-Serif",
            "Arial Black, Gadget, Sans-Serif",
            "Comic Sans MS, Textile, Cursive",
            "Courier New, Courier, Monospace",
            "Georgia, Times New Roman, Times, Serif",
            "Impact, Charcoal, Sans-Serif",
            "Lucida Console, Monaco, Monospace",
            "Lucida Sans Unicode, Lucida Grande, Sans-Serif",
            "Palatino Linotype, Book Antiqua, Palatino, Serif",
            "Tahoma, Geneva, Sans-Serif",
            "Times New Roman, Times, Serif",
            "Trebuchet MS, Helvetica, Sans-Serif",
            "Verdana, Geneva, Sans-Serif",
            "MS Sans Serif, Geneva, Sans-Serif",
            "MS Serif, New York, Serif",
        ]
        this.fontList = fontList;
    }
}
