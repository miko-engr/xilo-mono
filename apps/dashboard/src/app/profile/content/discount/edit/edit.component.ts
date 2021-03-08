import { Component, OnInit } from '@angular/core';
import { Company } from '../../../../models/company.model';
import { Discount } from '../../../../models/discount.model';
import { Form } from '../../../../models/form.model';
import { CompanyService } from '../../../../services/company.service';
import { DiscountService } from '../../../../services/discount.service';
import { LogService } from '../../../../services/log.service';
import { FormService } from '../../../../services/form.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../discount.component.css']
})
export class EditComponent implements OnInit {
  id: number;
  private sub: any;

  company = new Company(null);
  companyRetrieved = false;

  discountsRetrieved = false;
  formsRetrieved = false;

  hasAutoDiscounts = false;
  hasHomeDiscounts = false;

  selectedDiscount: Discount;

  discounts: Discount[] = [];
  forms: Form[] = [];

  constructor(
    private companyService: CompanyService,
    private discountService: DiscountService,
    private logService: LogService,
    private formService: FormService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getCompany();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; }); // (+) converts string 'id' to a number
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
            this.selectedDiscount = this.discounts[this.id];
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
            for (let form of this.forms) {
                for (let discount of this.discounts) {
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
        })
  
  }

  reorderDiscounts() {
    this.discounts.sort((a,b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
    this.discountsRetrieved = true;
  }

  updateDiscount(discount: Discount) {
    discount.hasExternalUrl = this.returnExists(discount.externalUrl) ? true : false;
    discount.hasMoreInfo = this.returnExists(discount.moreInformation) ? true : false;
    this.discountService.patch(discount)
        .subscribe(updatedDiscount => {
            this.logService.success('Discount updated successfully');
        }, error => {
            this.logService.console(error, true);
        });
}

private returnExists(value) {
  if ((typeof value != 'undefined' && value && value !== '') || value === false) {
      return true;
  } else {
      return false;
  }
}

}
