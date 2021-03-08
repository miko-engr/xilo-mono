import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../environments/environment';

@Injectable()
export class FormBuilderService {
    apiUrl = `${environment.apiUrl}form-view`;
    noteLoaded = new BehaviorSubject<boolean>(false);
    formStateChanged = new BehaviorSubject<boolean>(false);
    formFieldsChanged = new BehaviorSubject<any>({});
    pdfChanged = new BehaviorSubject<any>(false);
    formTreeDragging = new BehaviorSubject<any>(false);
    formFieldData = new BehaviorSubject<any>({});
    searchQuestions = new BehaviorSubject<string>(null);
    form;
    formObs$ = new BehaviorSubject(null);

    constructor(
        private http: HttpClient
        ) {}

    changeNoteState(hasLoaded: boolean) {
        this.noteLoaded.next(hasLoaded)
    }

    changeFormState(hasChanged: boolean) {
        this.formStateChanged.next(hasChanged)
    }

    changePDF(change: boolean) {
        this.pdfChanged.next(change);
    }

    changeFormFields(data: Object) {
        this.formFieldsChanged.next(data)
    }

    changeFormFieldData(data: Object) {
        this.formFieldData.next(data)
    }

    changeFormTreeDragging(change: boolean) {
        this.formTreeDragging.next(change)
    }

    onSearchQuestion(value: string) {
        this.searchQuestions.next(value)
    }

    setForm(form: any) {
        this.form = form;
    }

    getForm() {
        return this.form;
    }

    getFormObs() {
        return this.formObs$.asObservable();
    }

    setFormObs(form) {
        this.formObs$.next(form);
    }

}
