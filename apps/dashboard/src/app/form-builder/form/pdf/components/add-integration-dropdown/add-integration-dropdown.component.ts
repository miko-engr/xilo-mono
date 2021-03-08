import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-form-builder-component-add-pdf-dropdown',
  template: `
    <ng-container>
      <div class="btn-group" dropdown>
        <button id="button-basic" dropdownToggle type="button" class="btn add-integration-dropdown"
                aria-controls="dropdown-basic">
          <span class="text">Add integration</span>
          <div class="separator"></div>
          <ngx-icon
            svgSrc="chevron-bold-down"
            class="chevron-bold-down"
          >
          </ngx-icon>
        </button>
        <ul id="dropdown-basic" *dropdownMenu class="dropdown-menu"
            role="menu" aria-labelledby="button-basic">
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
  styleUrls: ['./add-integration-dropdown.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true }}]
})
export class AddPdfDropdownComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {

  }

}
