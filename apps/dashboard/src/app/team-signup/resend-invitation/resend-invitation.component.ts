import { Component, OnInit } from '@angular/core';
import { TeamSignupService } from '../../services/team-signup.service';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-resend-invitation',
  templateUrl: './resend-invitation.component.html',
  styleUrls: ['../team-signup.component.scss']
})
export class ResendInvitationComponent {
  emailRegExp: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  email = new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.emailRegExp)]));
  constructor(
    private teamSignupService: TeamSignupService,
    private toastService : ToastService,
    private router: Router,
    ) { }

  resendInvitation() {
    if (this.email.invalid) {
      this.email.markAllAsTouched();
      return false;
    }
    const data = {
      email: this.email.value,
    };
    this.teamSignupService.resendLinkInvitation(data).subscribe(res => {
      this.email = new FormControl('');
      this.email.markAsUntouched();
      this.toastService.showSuccess('Invitation link sent successfully');
    }, error => {
      this.toastService.showError(error.error.error.message);
    });
  }

  cancel() {
    this.router.navigate(['/team-signup']);
  }

}
