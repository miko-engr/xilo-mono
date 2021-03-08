import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ContractCompany, ContractDetails } from '../models/account-details.model';
import { ToastService } from '../../services/toast.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { formatAddress } from '../../utils/utils';
import { LoaderModalService } from '../../services/loader-modal.service';
import { UploadService } from '../../services/upload.service';

@Component({
    selector: 'app-team-signup-company-details',
    templateUrl: './company-details.component.html',
    styleUrls: ['../team-signup.component.scss']
})
export class TeamSignupCompanyDetailsComponent implements OnInit {
    @Output() next: EventEmitter<number> = new EventEmitter();
    @Input() company: ContractCompany;
    @Input() contract: ContractDetails;
    tempColor: string;
    imageSrc = null;
    formData: FormData;

    constructor(
        private loaderModalService: LoaderModalService,
        private toastService: ToastService,
        private uploadService: UploadService
    ) {}

    ngOnInit() {}

    makeCopy(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }

    arrayList(startFrom: number = 0, n: number = 1, inc: number = 1): number[] {
        return [...Array(n).keys()].map(i => startFrom + i * inc);
    }

    onNext() {
        this.contract.company = this.company;
        this.contract.phone = this.company.contactNumber;
        if (this.formData) {
            this.loaderModalService.openModalLoader('Logo uploading.');
            this.uploadService.postImage(this.formData).subscribe(file => {
              this.loaderModalService.closeModal();
              this.contract.company.logo = this.uploadService.bucketUrl + file['obj'].file;
              this.formData = new FormData();
              this.next.emit(2);
            }, error => {
              this.loaderModalService.closeModal();
              this.toastService.showError(error.error.error.message);
            });
        } else {
            this.next.emit(2);
        }
    }

    checkContactNumber() {
        const contactNumber = this.company.contactNumber && this.company.contactNumber.toString();
        if (contactNumber && contactNumber.length > 13) {
          this.company.contactNumber = contactNumber.slice(0, 13);
        } else {
          this.company.contactNumber = contactNumber;
        }
    }

    onChangeColor(event, type) {
        if(event.includes('rgba')) {
          this.company[type] = event;
        }
        const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const isValid = colorRegex.test(this.company[type]);
        if (!this.company[type] || (this.company[type] && this.company[type].length === event.length) || !isValid) {
          this.company[type] = event;
        }
    }

    isColorPickerOpen(type) {
        this.tempColor = this.company[type];
    }

    getImage(event) {
        this.formData = new FormData();
        this.imageSrc = null;
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          const fileSize = file.size / 1024 / 1024;
          if (fileSize > 4) {
            this.toastService.showError('File can not be greater than 4MB');
            return false;
          }
          this.formData.append('photos', file);
          const reader = new FileReader();
          reader.onload = e => this.imageSrc = reader.result;
          reader.readAsDataURL(file);
        }
    }

    addressChange(address: Address) {
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
          this.setContractAddress(city, state, zipCode, streetAddress);
        }else{
          this.company.fullAddress = null
          this.toastService.showError('Invalid address');
        }
    }

    setContractAddress(city: string, state: string, zipCode: number, streetAddress: string) {
        this.contract.city = city;
        this.contract.state = state;
        this.contract.zip = zipCode && zipCode.toString();
        this.contract.streetNumber = streetAddress;
    }
    
}