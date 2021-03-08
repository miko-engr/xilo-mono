import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SupportService } from './support.service';

export interface GuruCard {
    id: number;
    preferredPhrase: string;
    content: string; 
    boardNames: string[]; 
    tags: string;
}

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit{
    cards$: Observable<GuruCard[]>;
    selectedCard: GuruCard;
    searchQuery = '';

    constructor(
        private supportService: SupportService
    ) {
        this.cards$ = this.supportService.getCardsByQuery('');
    }

    ngOnInit() {
    }

    searchGuruCards() {
        this.cards$ = this.supportService.getCardsByQuery(this.searchQuery);
    }

}
