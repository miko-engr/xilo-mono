import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AlertControllerService } from '../../../services/alert.service';


@Component({
  selector: 'app-outlook-verify',
  templateUrl: './outlook-verify.component.html',
  styleUrls: ['./outlook-verify.component.css']
})
export class OutlookVerifyComponent implements OnInit {
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private alertService: AlertControllerService,
  ) { }

  ngOnInit() {
    this.authorizeOutlook();
  }

  authorizeOutlook() {
    this.route.queryParams.subscribe(params => {
        if (params.code) {
            this.apiService.authorizeoutlook(params.code)
                .subscribe(data => {
                    this.alertService.success('Outlook Authorization Successful');
                    this.router.navigate(['/profile/business/api']);
                }, (error) => {
                    this.alertService.warn('Outlook Authorization Error');
                });
        }

        if (params.error) {
            this.alertService.warn('Outlook Authorization Denied');
            this.router.navigate(['/profile/business/api']);
        }
    });
}

}