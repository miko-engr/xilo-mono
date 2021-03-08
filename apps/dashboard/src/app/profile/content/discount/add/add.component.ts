import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../../../../services/discount.service';
import { CompanyService } from '../../../../services/company.service';
import { LogService } from '../../../../services/log.service';
import { Company } from '../../../../models/company.model';
import { Discount } from '../../../../models/discount.model';
import { Form } from '../../../../models/form.model';
import { FormService } from '../../../../services/form.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['../discount.component.css']
})
export class AddComponent implements OnInit {
  company = new Company(null);
  companyRetrieved = false;

  discounts: Discount[] = [];
  forms: Form[] = [];

  hasAutoDiscounts = false;
  hasHomeDiscounts = false;

  discountsRetrieved = false;
  formsRetrieved = false;

  selectedDiscount: Discount = new Discount();

  constructor(
    private companyService: CompanyService,
    private discountService: DiscountService,
    private logService: LogService,
    private formService: FormService,
  ) { }

  ngOnInit() {
    this.getCompany();
  }

  getCompany() {
    this.company = new Company(null);
    this.companyService.get()
        .subscribe(company => {
            this.company = company['obj'];
            this.companyRetrieved = true;
            this.getDiscounts();
        }, error =>  {
            this.logService.console(error, true);
        });
}

getDiscounts() {
  this.discountService.get()
      .subscribe(discounts => {
          this.discounts = discounts['obj'];
          this.getForms();
          this.reorderDiscounts();
      }, error => {
          this.logService.console(error, true);
      });
}

getForms() {
  this.formService.getByCompany(true)
      .subscribe(forms => {
          this.forms = forms['obj'];
          for (const form of this.forms) {
              for (const discount of this.discounts) {
                  if (+discount.formDiscountId === +form.id && form.isAuto) {
                      this.hasAutoDiscounts = true;
                  } else if (+discount.formDiscountId === +form.id && form.isHome) {
                      this.hasHomeDiscounts = true;
                  }
              }
          }
          this.formsRetrieved = true;
      }, error => {
          this.logService.console(error, true);
      });

}

reorderDiscounts() {
  this.discounts.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
  this.discountsRetrieved = true;
}

  createDiscount() {
    if (this.selectedDiscount.title === '' || this.selectedDiscount.title === null) {
        this.logService.warn('Please mention a title name.');
    } else if (this.selectedDiscount.formDiscountId === undefined) {
        this.logService.warn('Please select any form.');
    } else {
        this.selectedDiscount.hasExternalUrl = (this.returnExists(this.selectedDiscount.externalUrl) || 
            this.returnExists(this.selectedDiscount.mobileUrl)) ? true : false;
        this.selectedDiscount.hasMoreInfo = this.returnExists(this.selectedDiscount.moreInformation) ? true : false;
        this.selectedDiscount.companyDiscountId = this.company.id;
        this.discountService.post(this.selectedDiscount)
            .subscribe(newDiscount => {
                this.discounts.push(newDiscount['obj']);
                this.onResetEditing();
                this.logService.success('New Discount created successfully');
            }, error => {
                this.logService.console(error, true);
            });
    }
}

onResetEditing() {
  this.selectedDiscount = new Discount(null, null, null, null);
}

private returnExists(value) {
  if ((typeof value != 'undefined' && value && value !== '') || value === false) {
      return true;
  } else {
      return false;
  }
}

}
