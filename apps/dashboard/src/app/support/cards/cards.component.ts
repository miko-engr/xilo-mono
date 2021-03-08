import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface GuruCard {
    id: number;
    preferredPhrase: string;
    content: string; 
    boardNames: string[]; 
    tags: string;
}

@Component({
    selector: 'app-support-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss']
})
export class SupportCardComponent implements OnInit{
    @Input() card: GuruCard;
    @Output() back: EventEmitter<boolean> = new EventEmitter();

    constructor() {}

    ngOnInit() {
    }

    onBack() {
        this.back.emit(true);
    }

}
