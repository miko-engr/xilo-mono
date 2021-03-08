import { Component, OnInit } from '@angular/core';

import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {AlertControllerService} from "../../services/alert.service";
import { Agent } from "../../models/agent.model";
import { AgentService } from "../../services/agent.service";

@Component({
    selector: 'app-automation',
    templateUrl: './automation.component.html',
    styleUrls: ['../business/business.component.css', './automation.component.css']
})
export class AutomationComponent implements OnInit {
    // Agent Email Variables
    agents: Agent[] = [];
    agent: Agent = new Agent(null, '', '');
    agentIndex = null;
    editAgentEmail = false;
    editAgentName = false;
    editAgentPassword = false;
    editAgentPasswordConfirm = false;
    emailRegex =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    disableAddAgent = false;
    loading = false;
    agentRetrieved = false;
    agentPasswordConfirm: string;
    retrivedAgent = false;

    //popup
    show = false;

    // User Variables
    userIndex = null;
    editUserEmail = false;
    editUserPassword = false;
    editUserPasswordConfirm = false;
    editUserPasswordNew = false;
    disableAddUser = false;
    currentUser = new User(null, '', '', '','', '', true);
    user = new User(null, '', '', '', '', '', true);
    users: User[] = [];
    userRetrieved = false;
    usersRetrieved = false;
    userPasswordConfirm: string;
    retrivedUser = false;

    constructor(
        private agentService: AgentService,
        private alertService: AlertControllerService,
        private userService: UserService
    ) { }

    ngOnInit() {
  
    }

    // Styles the tabs with a border bottom
    styleTabs(style: boolean) {
        if (style === true) {
            return {'border-bottom': '4px solid #7c7fff', 'color': '#000'};
        }
    }

    // Creates a new agent and adds to users agent array
    createAgent() {
        if (this.agent.password !== this.agentPasswordConfirm) {
            return this.alertService.error('Your passwords did not match');
        }

        if ((this.agent.name !== '' && this.agent.name !== null) &&
            (this.agent.email !== '' && this.agent.email !== null) &&
            (this.agent.password !== '' && this.agent.password !== null)) {
            this.agentService.post(this.agent)
                .subscribe(agent => {
                    this.agents.push(agent['obj']);
                    this.alertService.success('New agent was added successfully!');
                    this.resetAgentInputs();
                }, error => {
                    this.alertService.serverError(error.error.errorType, error.error.data);
                });
        } else {
            this.alertService.warn('Please fill in an agent email and agent name');
        }
    }

    // Deletes an agent and removes from current array of agents
    deleteAgent() {
        this.loading = true;
            this.agentService.delete(this.agent)
                .subscribe(agent => {
                    this.agents.splice(this.agentIndex, 1);
                    this.loading = false;
                    this.resetAgentInputs();
                    this.alertService.success('Agent Removed Successfully');
                }, error => {
                    this.loading = false;
                    this.alertService.serverError(error.error.errorType, error.error.data);
        });

    }

    // Allows user to edit an input
    editAgentInput(input: string){
        if (input === 'agentEmailId') {
            this.editAgentEmail = true;
        } else if (input === 'agentName') {
            this.editAgentName = true;
        } else if (input === 'agentPassword') {
            this.editAgentPassword = true;
        } else if (input === 'agentPasswordConfirm') {
            this.editAgentPasswordConfirm = true;
        }
    }

    getAgents() {
        this.agents = [];
        this.loading = true;
        this.agentService.getUserAgents()
            .subscribe(agents => {
                this.loading = false;
                this.agents = agents['obj'];
                this.agentRetrieved = true;
            }, error =>  {
                this.loading = false;
                this.alertService.serverError(error.error.errorType, error.error.data);
            });
    }

    // Change index of agents
    onChangeAgentEmail(agentEmailEvent: number) {
        if (agentEmailEvent !== null) {
            this.retrivedAgent = true;
            this.editAgentEmail = true;
            this.editAgentName = true;
            this.agentIndex = agentEmailEvent;
            this.agent = this.agents[agentEmailEvent];
        } else {
            this.resetInputs();
        }
    }

    // Show instructions for Agents
    toggleInfo() {
        this.show = !this.show;
    }

    // Update an agent
    updateAgent() {
        this.loading = true;
        this.agentService.patch(this.agent)
            .subscribe(updatedAgent => {
                this.loading = false;
                this.resetAgentInputs();
                this.alertService.success('Agent Updated Successfully');
            }, error => {
                this.loading = false;
                this.alertService.serverError(error.error.errorType, error.error.data);
            });
    }

    // Reset all vars to give user experience of clearing screen
    resetAgentInputs() {
        this.agent = new Agent(null, '', '');
        this.agentIndex = null;
        this.editAgentEmail = false;
        this.editAgentName = false;
        this.editAgentPassword = false;
        this.editAgentPasswordConfirm = false;
        this.agentPasswordConfirm = '';
    }

    // User code

    // Creates a new user and adds to users user array
    createUser() {
        if (this.user.password !== this.userPasswordConfirm) {
            return this.alertService.error('Your passwords did not match');
        }

        if ((this.user.username !== '' && this.user.username !== null) &&
            (this.user.password !== '' && this.user.password !== null)) {
            this.userService.post(this.user)
                .subscribe(user => {
                    this.users.push(user['obj']);
                    this.alertService.success('New user was added successfully!');
                    this.resetInputs();
                }, error => {
                    this.alertService.serverError(error.error.errorType, error.error.data);
                });
        } else {
            this.alertService.warn('Please fill in an user email and user name');
        }
    }

    // Allows user to edit an input
    editInput(input: string){
        if (input === 'userEmailId') {
            this.editUserEmail = true;
        } else if (input === 'userPassword') {
            this.editUserPassword = true;
        } else if (input === 'userPasswordConfirm') {
            this.editUserPasswordConfirm = true;
        } else if (input == 'userPasswordNew') {
            this.editUserPasswordNew = true;
        }
    }

    getUsers() {
        this.userService.getByCompany()
            .subscribe(users => {
                this.users = [];
                this.users = users['obj'];
                this.usersRetrieved = true;
            }, error => {
                this.alertService.serverError(error.error.errorType, error.error.data);
            })
    }

    // Retrieve user
    getUser() {
        this.user = new User(null, '', '', '', '', '', true);
        this.loading = true;
        this.userService.get()
            .subscribe(user => {
                this.loading = false;
                this.currentUser = user['obj'];
                this.userRetrieved = true;
            }, error =>  {
                this.loading = false;
                this.alertService.serverError(error.error.errorType, error.error.data);
            });
    }

    // Change index of users
    onChangeUserEmail(userEmailEvent: number) {
        if (userEmailEvent !== null) {
            this.retrivedUser = true;
            this.editUserEmail = true;
            this.userIndex = userEmailEvent;
            this.user = this.users[userEmailEvent];
            this.user.password = null;
        } else {
            this.resetInputs();
        }
    }

    // Update an user
    updateUser() {
        if ((this.user.password == '' || this.user.password == null) ||
            (this.userPasswordConfirm == '' || this.userPasswordConfirm == undefined)) {
                return this.alertService.warn('Please enter new password and confirm password');
            }

        if (this.user.password !== this.userPasswordConfirm) {
            return this.alertService.error('Your new passwords did not match');
        }

        this.loading = true;
        this.userService.patchUser(this.user)
            .subscribe(updatedUser => {
                this.loading = false;
                this.resetInputs();
                this.alertService.success('User Updated Successfully');
            }, error => {
                this.loading = false;
                this.alertService.serverError(error.error.errorType, error.error.data);
            }
        );
    }

    // Reset all vars to give user experience of clearing screen
    resetInputs() {
        this.user = new User(null, '', '', '','', '',  true);
        this.userIndex = null;
        this.editUserEmail = false;
        this.editUserPassword = false;
        this.editUserPasswordConfirm = false;
        this.editUserPasswordNew = false;
        this.userPasswordConfirm = '';
    }


}
