import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Apis } from '../../utils/apis-list';

@Component({
    selector: 'app-team-signup-integration-selection',
    templateUrl: './integration-selection.component.html',
    styleUrls: ['../team-signup.component.scss']
})
export class TeamSignupIntegrationSelectionComponent implements OnInit {
    @Output() next: EventEmitter<number> = new EventEmitter();
    @Output() updateArray: EventEmitter<Array<any>> = new EventEmitter();
    @Input() selectedApis: string[];
    apiList = new Apis().apiList;

    constructor() {}

    ngOnInit() {}

    onChange(event) {
        this.updateArray.emit(event);
    }

    onNext() {
        this.next.emit(5);
    }
    
}