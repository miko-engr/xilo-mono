import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { Company } from '../../../models/company.model';
import { UploadService } from '../../../services/upload.service';
import { AlertControllerService } from '../../../services/alert.service';
import { SignupFlowService } from '../../..//services/signup-flow.service';
import { LoaderModalService } from '../../../services/loader-modal.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-brand-info',
  templateUrl: './brand-info.component.html',
  styleUrls: ['../company-info/company-info.component.scss']
})
export class BrandInfoComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  @Output() onUpdated = new EventEmitter<any>();
  @Input() brandInfo: Company;
  company = new Company(null);
  @Input() action: string;
  formData: FormData;
  imageSrc = null;
  isFileLarge = false
  tempColor: string;
  constructor(
    private uploadService: UploadService,
    private signupFlowService: SignupFlowService,
    private loaderModalService: LoaderModalService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.company = this.brandInfo;
    if (this.company.logo) {
      this.loaderModalService.openModalLoader(null);
    }
    this.checkUpdate();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateBrandInfo(formData) {
    if (formData) {
      this.loaderModalService.openModalLoader('Logo uploading.');
      this.uploadService.postImage(formData).subscribe(file => {
        this.loaderModalService.closeModal();
        this.company.logo = this.uploadService.bucketUrl + file['obj'].file;
        this.updateBrand();
      }, error => {
        this.loaderModalService.closeModal();
        this.toastService.showError(error.error.error.message);
      });
    } else {
      this.updateBrand();
    }
  }

  checkUpdate() {
    const event = this.signupFlowService.updateStep.subscribe(res => {
      if (res === 'updateBrand') {
        this.updateBrandInfo(this.formData);
      }
    });
    this.subscription.add(event);
  }

  updateBrand() {
    this.onUpdated.emit(this.company);
  }

  onChangeColor(event, type) {
    if(event.includes('rgba')) {
      this.company[type] = event;
    }
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const isValid = colorRegex.test(this.company[type]);
    if (!this.company[type] || (this.company[type] && this.company[type].length >= event.length) || !isValid) {
      this.company[type] = event;
    }
  }

  isColorPickerOpen(type) {
    this.tempColor = this.company[type] || '#111111';
  }

  getImage(event) {
    this.formData = new FormData();
    this.imageSrc = null;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 4) {
        this.toastService.showError('File can not be greater than 4MB');
        this.isFileLarge = true
        return false;
      }else{
        this.isFileLarge = false        
        this.formData.append('photos', file);
        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;    
        reader.readAsDataURL(file);
        this.isInputChange();
      }
     
    }
  }

  isInputChange() {
    this.signupFlowService.isChanged = true;
  }

  isLoadLoaded() {
    setTimeout(() => {
      this.loaderModalService.closeModal();
    }, 100);
  }

}
