import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['../business/business.component.css', './content.component.css']
})
export class ContentComponent implements OnInit {

    constructor(
    ) { }

    ngOnInit() {  
    }

    // Styles the tabs with a border bottom
    styleTabs(style: boolean) {
        if (style === true) {
            return {'border-bottom': '4px solid #7c7fff', 'color': '#000'};
        }
    }


}
