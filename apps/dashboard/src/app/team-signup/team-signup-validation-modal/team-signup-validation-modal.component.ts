import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TeamSignupService } from '../../services/team-signup.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-team-signup-validation-modal',
  templateUrl: './team-signup-validation-modal.component.html',
  styleUrls: ['../team-signup.component.scss']
})
export class TeamSignupValidationModalComponent {
  username = null;
  password = null;
  constructor(
    public dialogRef: MatDialogRef<TeamSignupValidationModalComponent>,
    private teamSignupService: TeamSignupService,
    private toastService: ToastService,
    ) { }

  login(value) {
    if (!value.username || !value.password) {
      return false;
    }
    const data = {
      username: value.username,
      password: value.password,
    };
    this.teamSignupService.loginAsEmployee(data).subscribe((res: any) => {
      localStorage.setItem('userType', res.userType);
      localStorage.setItem('token', res.token);
      this.toastService.showSuccess('Logged in successfully ');
      this.dialogRef.close('Password Valid');
    }, error => {
      this.toastService.showError(error.error.error.message);
    });
  }

}
