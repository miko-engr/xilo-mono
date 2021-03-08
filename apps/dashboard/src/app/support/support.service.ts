
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { delay } from 'rxjs/internal/operators/delay';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class SupportService {
    apiUrl: string = environment.apiUrl + 'guru';
    cards = [
        { 
            id: 1,
            preferredPhrase: 'How to integrate into EZLynx',
            content: 'This is an example card with some example content', 
            boardNames: ['Forms', 'Integrations'],
            tags: ['EZLynx', 'How to'],
        },
        { 
            id: 2,
            preferredPhrase: 'How to integrate into EZLynx',
            content: 'This is an example card with some example content', 
            boardNames: ['Forms', 'Integrations'],
            tags: ['EZLynx', 'How to'],
        },
        { 
            id: 3,
            preferredPhrase: 'How to integrate into EZLynx',
            content: 'This is an example card with some example content', 
            boardNames: ['Forms', 'Integrations'],
            tags: ['EZLynx', 'How to'],
        },
        { 
            id: 4,
            preferredPhrase: 'How to integrate into EZLynx',
            content: 'This is an example card with some example content', 
            boardNames: ['Forms', 'Integrations'],
            tags: ['EZLynx', 'How to'],
        },
        { 
            id: 5,
            preferredPhrase: 'How to integrate into EZLynx',
            content: 'This is an example card with some example content', 
            boardNames: ['Forms', 'Integrations'],
            tags: ['EZLynx', 'How to'],
        },
        { 
            id: 6,
            preferredPhrase: 'How to integrate into EZLynx',
            content: 'This is an example card with some example content', 
            boardNames: ['Forms', 'Integrations'],
            tags: ['EZLynx', 'How to'],
        }
    ]
    constructor(
        private http: HttpClient
        ) {}


    getCardsByQuery(searchQuery: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/search?search=${searchQuery}`);
    }

}