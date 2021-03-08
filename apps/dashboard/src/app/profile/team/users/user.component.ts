import {Component, OnInit} from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import {MatTableDataSource} from '@angular/material/table';
import { Email } from '../../../models/email.model';
import { LogService } from '../../../services/log.service';
import { EmailService } from '../../../services/email.service';

@Component({
    selector: 'app-team-user',
    templateUrl: './user.component.html',
    styleUrls: ['../team.component.css']
})
export class TeamUserComponent implements OnInit {
    editingUser = new User(null, null, null, null, null, null);
    addingUser = new User(null, null, null, null, null, null);
    users: User[] = [];
    user: User = new User(null, null, null, null, null, null);
    newUser: User = new User(null, null, null, null, null, null);
    addUser = false;
    editUser = false;
    passwordConfirmation = '';
    dataSource = new MatTableDataSource();
    loading = false;

    columnsToDisplay = ['name', 'email', 'action', 'isActive'];

    constructor(
        private emailService: EmailService,
        private logService: LogService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.getUsers();
    }

    // Deletes an user and removes from current array of users
    deleteUser() {
      if (confirm('Are you sure you want to delete this admin?')) {
        this.userService.delete(this.user)
            .subscribe(user => {
                this.users.splice(this.users.indexOf(this.user), 0);
                this.resetUser();
                this.getUsers();
                this.logService.success('Admin Removed Successfully');
                this.dataSource.data = this.users;
            }, error => {
                this.logService.console(error, false);
            });
      }
    }

    getUserById(user) {
        this.editUser = true;
        this.userService.getById(user)
            .subscribe(user => {
                this.user = user['obj'];
            }, error => {
                
            });
    }
  
    getUsers() {
        this.userService.getByCompany()
            .subscribe(users => {
                this.users = users['obj'];
                this.dataSource.data = this.users;
            }, error => {
                
                this.logService.console(error, false);
            });
    }

    resetUser() {
        this.editUser = false;
        this.addUser = false;
        if (this.user.id !== null) {
            this.user = new User(null);
        } else if (this.newUser.username !== null) {
            this.newUser = new User(null, null);
        }
        this.passwordConfirmation = '';
    }

    updateUser(user) {
        this.loading = true;
        if (this.editUser) {
            if (this.passwordConfirmation !== this.user.password && typeof this.user.password != 'undefined') {
                this.logService.warn('Password Do Not Match! Please Try Again');
                this.loading = false;
            } else {
                this.update(this.user, true)
            }
        } else if (this.addUser) {
            if (this.passwordConfirmation !== this.newUser.password) {
                this.logService.warn('Passwords Do Not Match! Please Try Again');
                this.loading = false;
            } else {
                this.userService.post(this.newUser)
                    .subscribe(user => {
                        this.sendNewUserEmail();
                        this.users.push(user['obj']);
                        this.dataSource.data = this.users;
                    }, error => {
                        this.loading = false;
                        this.logService.console(error, false);
                    });
            }
        } else {
            user.isActive = !user.isActive;
            this.update(user, false);
        }
    }

    update(user, isEditUser) {
        this.userService.patchUser(user)
            .subscribe(user => {
                this.logService.success('User Updated Successfully');
                this.dataSource.data = this.users
                if (isEditUser) {
                    this.resetUser()
                }
                this.getUsers();
                this.loading = false;
            }, error => {
                this.loading = false;
                this.logService.console(error, true);
            });
    }

    sendNewUserEmail() {
        const newEmail = new Email();
        newEmail.body =
        `Hi, ${this.newUser.firstName}.<br>
        <br>
        Welcome to XILO! XILO offers unique quoting experiences (web forms) that your team can use to make quoting easier for the insured and<br>
        faster for your agency. Login using the credentials below on the <a href="https://dashboard.xilo.io" target="_blank">XILO Dashboard</a>.<br>
        <br>
        Login Credentials:<br>
        ${this.newUser.username}<br>
        ${this.newUser.password}<br>
        <br>
        With XILO you'll now be able to send forms to prospects that they'll actually fill out. Every question is tailored to your agency<br>
        and your sales process. Those submissions are then either integrated into your existing systems, making your life easier! You'll be<br> 
        able to pick up where they left off with XILO Simple Forms and even manage your pipeline coming in with the XILO Dashboard. <br>
        <br>
        We look forward to working with you and can't wait for you to start utilizing XILO as a resource for your agency.<br>
        <br>
        <small>Note: The web forms do not work well with older versions of IE. 95% of prospects will use Chrome, Safari, Edge so this isn’t an issue.<br>
        Microsoft gave up support for IE in 2016 and its now become a huge security risk to use the browser. I’d suggest moving to Edge if you use IE<br>
        to keep your information secure. Here’s a supporting article on it:<br>
        https://www.telegraph.co.uk/technology/2019/02/08/stop-using-internet-explorer-warns-microsofts-security-chief/</small><br>
        <br>
        Sincerely,<br>
        Team XILO <br>
        619-488-6476 <br>
        customer-success@xilo.io <br>
        San Diego, CA`;

        newEmail.isSentNow = true;
        newEmail.recipient = this.newUser.username;
        newEmail.subject = 'Your New XILO Admin Account';

        this.emailService.post(newEmail)
        .subscribe(data => {
            this.loading = false;
            this.resetUser();
            this.getUsers();
            this.logService.success('New Admin Created Successfully');
        }, error => {
            this.loading = false;
            this.logService.console(error, false);
        });
    }


    styleGroups() {
        return {'margin-bottom': '37px'};
    }


}
