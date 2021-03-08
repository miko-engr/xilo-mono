import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-form-builder-component-pdf-question-dropdown',
  template: `
    <ng-container>
      <div dropdown class="btn-group">
        <button class="question-dropdown" dropdownToggle id="dropdown-button">
          <span>Display: All</span>
          <ngx-icon
            svgSrc="chevron-bold-down"
            class="chevron-bold-down"
          >
          </ngx-icon>
        </button>
        <ul id="dropdown-basic" *dropdownMenu class="dropdown-menu"
          role="menu" aria-labelledby="dropdown-button">
          <li role="menuitem"><a class="dropdown-item" href="#">Action</a></li>
          <li role="menuitem"><a class="dropdown-item" href="#">Another action</a></li>
          <li role="menuitem"><a class="dropdown-item" href="#">Something else here</a></li>
          <li class="divider dropdown-divider"></li>
          <li role="menuitem"><a class="dropdown-item" href="#">Separated link</a>
          </li>
        </ul>
      </div>
    </ng-container>
  `,
  styleUrls: ['./question-dropdown.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true }}]
})
export class PdfQuestionDropdownComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {

  }

}
