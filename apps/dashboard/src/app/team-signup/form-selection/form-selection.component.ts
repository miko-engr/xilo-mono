import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoaderModalService } from '../../services/loader-modal.service';
import { FormService } from '../../services/form.service';
import { Form } from '../../models/form.model';

@Component({
    selector: 'app-team-signup-form-selection',
    templateUrl: './form-selection.component.html',
    styleUrls: ['../team-signup.component.scss']
})
export class TeamSignupFormSelectionComponent implements OnInit {
    @Output() next: EventEmitter<number> = new EventEmitter();
    @Output() updateArray: EventEmitter<Array<Form>> = new EventEmitter();
    @Input() selectedForms: number[];
    formsList: any[];

    constructor(
        private formService: FormService,
        private loaderModalService: LoaderModalService,
    ) {}

    async ngOnInit() {
        await this.getFormList();
    }

    onNext() {
        this.next.emit(4);
    }

    onChange(event) {
        this.updateArray.emit(event);
    }

    async getFormList() {
        this.loaderModalService.openModalLoader('');
        this.formsList = await this.formService.getDefaultForms();
        this.loaderModalService.closeModal();
    };
    
}