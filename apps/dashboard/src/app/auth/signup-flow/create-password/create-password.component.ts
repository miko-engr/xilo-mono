import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { User } from '../../../models/user.model';
import { SignupFlowService } from '../../../services/signup-flow.service';
import { TeamSignupService } from '../../../services/team-signup.service';
import { ToastService } from '../../../services/toast.service';
@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit {
  createPasswordForm: FormGroup;
  user = new User();
  isAgencyInvited: Boolean = false;
  isAgent: Boolean = false;
  isEmployeeInvited: Boolean = false;
  isLoading: Boolean = false;
  emailRegExp: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  passwordRegExp: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private signupFlowServices: SignupFlowService,
    private teamSignupService: TeamSignupService,
    private toastService: ToastService,
    ) { }

  ngOnInit(): void {
    this.createForm();
    const email = decodeURIComponent(this.route.snapshot.queryParamMap.get('email'));
    const invited = decodeURIComponent(this.route.snapshot.queryParamMap.get('invited'));
    const token = decodeURIComponent(this.route.snapshot.queryParamMap.get('token'));
    if (email && this.validateEmail(email) && invited && token) {
      this.checkTokenValidation(token);
      this.user.username = email;
    } else {
      localStorage.clear();
      this.router.navigate(['/']);
    }
  }

  checkTokenValidation(token) {
    this.isLoading = true;
    this.teamSignupService.validateInviteToken(token).subscribe((res: any) => {
      this.isLoading = false;
      this.isEmployeeInvited = true;
      if (res.obj && res.obj.user && res.obj.user.sendBy) {
        const user = res.obj.user;
        this.checkInvitedType(token, user, res.hasCreatedPassword || false);
      } else {
        this.returnToHome();
      }
    }, error => {
      this.isLoading = false;
      this.toastService.showError(error.error.message);
    });
  }

  checkInvitedType(token, user, hasCreatedPassword: boolean) {
    this.isAgencyInvited = false;
    this.isEmployeeInvited = false;
    localStorage.clear();
    if (user.sendBy === 'member') {
      this.isAgencyInvited = true;
      if (user.userType === 'agent') {
        this.isAgent = true;
      }
      this.setDatainStorage(token, user, hasCreatedPassword);
    } else if (user.sendBy === 'employee') {
      this.isEmployeeInvited = true;
      this.setDatainStorage(token, user, hasCreatedPassword);
    } else {
      this.returnToHome();
    }
  }

  returnToHome() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  setDatainStorage(token, user, hasCreatedPassword) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('email', user.username);
    if (this.isAgencyInvited && hasCreatedPassword) {
      return this.router.navigate(['/profile/agent']);
    } else if (this.isEmployeeInvited && hasCreatedPassword) {
      this.router.navigate(['auth/signup-flow/company-info']);
    }
  }

  validateEmail(email) {
    const re = this.emailRegExp;
    return re.test(email);
  }

  createForm() {
    this.createPasswordForm = this.fb.group({
      password: ['', Validators.compose([Validators.required, Validators.pattern(this.passwordRegExp)])],
      confirmPassword: ['', Validators.compose([Validators.required])]
    }, {validator: this.passwordConfirming});
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmPassword').value) {
        return {invalid: true};
    }
  }

  next() {
    if (this.isLoading) {
      return false;
    }
    this.user.password = this.createPasswordForm.value.password;
    if (this.user.username === null || this.user.password === null) {
      return this.toastService.showWarn('Please fill in all information');
    } else if (this.user.password === this.createPasswordForm.value.password) {
      const data = {
        email: this.user.username,
        password: this.user.password,
        isAgent: this.isAgent
      };
      this.signupFlowServices.createPassword(data).subscribe(res => {
        if (this.isEmployeeInvited) {
          this.router.navigate(['auth/signup-flow/contract']);
        }  else if (this.isAgencyInvited && this.isAgent) {
          this.toastService.showSuccess('Password created successfully');
          setTimeout(() => {
            this.router.navigate(['auth/agent-login'])  
          }, 1000);
          localStorage.clear();
        } else {
          this.toastService.showSuccess('Password created successfully');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
          localStorage.clear();
          
        }
      }, error => {
        this.toastService.showError('Password already created');
      });
    }
  }
}
