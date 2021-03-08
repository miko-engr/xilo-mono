import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-agent-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})

export class AgentProfileComponent implements OnInit {

    show = false;
    
    ngOnInit() {
    }

    toggleInfo() {
        this.show = !this.show;
    }
}