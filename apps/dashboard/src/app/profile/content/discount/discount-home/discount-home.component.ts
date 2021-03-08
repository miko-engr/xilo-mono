import { Component, OnInit } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Discount } from '../../../../models/discount.model';
import { Company } from '../../../../models/company.model';
import { CompanyService } from '../../../../services/company.service';
import { DiscountService } from '../../../../services/discount.service';
import { LogService } from '../../../../services/log.service';
import { FormService } from '../../../../services/form.service';
import { Form } from '../../../../models/form.model';

@Component({
  selector: 'app-discount-home',
  templateUrl: './discount-home.component.html',
  styleUrls: ['../discount.component.css']
})
export class DiscountHomeComponent implements OnInit {

  company = new Company(null);
  companyRetrieved = false;

  discountsRetrieved = false;
  formsRetrieved = false;
  editingDiscountPosition = false

  hasAutoDiscounts = false;
  hasHomeDiscounts = false;

  selectedDiscount = new Discount(null, null, null, null, null);

  discounts: Discount[] = [];
  forms: Form[] = [];



  constructor(
    private companyService: CompanyService,
    private discountService: DiscountService,
    private logService: LogService,
    private formService: FormService
  ) { }

  ngOnInit() {
    this.getCompany();
  }

  dropItDiscounts(event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
        moveItemInArray(this.discounts, event.previousIndex, event.currentIndex);
        this.discounts.forEach((discount, i) => {
            discount.position = i;
        });
    }
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

deleteDiscount(i: number) {
  if (confirm('Are you sure you want to delete this discount?')) {
      this.discountService.delete(this.discounts[i])
      .subscribe(data =>{
              this.discounts.splice(i, 1);
          },error =>{
              this.logService.console(error, true);
          });
  } 
}

}
