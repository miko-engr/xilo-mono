import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocuSignService } from '../../../services/docu-sign.service';
import { LoaderModalService } from '../../../services/loader-modal.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  url = '';
  isGoToNext: Boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private docuSignService: DocuSignService,
    private loaderModalService: LoaderModalService,
    private toastService: ToastService,
    ) { }

  ngOnInit(): void {
    const email = decodeURIComponent(this.route.snapshot.queryParamMap.get('email'));
    const docuSignEmail = localStorage.getItem('email');
    const event = decodeURIComponent(this.route.snapshot.queryParamMap.get('event'));
    if (email && event === 'signing_complete') {
      this.isGoToNext = true;
      this.toastService.showSuccess('Contract signing completed successfully');
      localStorage.setItem('isContractSigned', event);
      this.navigateToPayment(docuSignEmail);
    } else {
      const docuSignEmail = localStorage.getItem('email');
      const params = docuSignEmail + '/' + encodeURIComponent(window.location.href + '?email=' + docuSignEmail);
      this.loaderModalService.openModalLoader(null);
      this.docuSignService.getdocuSign(params).subscribe((res: any) => {
        this.url = res.url || '';
        window.location.replace(this.url);
      }, error => {
        this.loaderModalService.closeModal();
        this.toastService.showError(error.error.error.message);
      });
    }
  }

  navigateToPayment(email) {
    this.loaderModalService.openModalLoader(null);
    this.docuSignService.docuSignByDocument(email).subscribe((res: any) => {
      this.loaderModalService.closeModal();
      this.router.navigateByUrl('/auth/signup-flow/payment');
    }, error => {
      this.loaderModalService.closeModal();
      this.toastService.showError(error.error.error.message);
    });
  }

}
