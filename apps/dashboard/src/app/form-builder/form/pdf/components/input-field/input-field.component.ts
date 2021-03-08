import { Component, OnInit, Input } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'pdf-input-field',
  template: `
    <div class="label" [ngClass]="{'highlighted' : highlighted}">
      <div>{{companyName}} Input field #{{index + 1}}</div>
      <ngx-icon
        svgSrc="info-icon"
        class="info-icon"
      >
      </ngx-icon>
    </div>
    <div (treeDrop)="onDrop($event)" (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" [treeAllowDrop]="allowDrop.bind(this)" class="btn-group input-container" dropdown>
      <button class="input-field" [ngClass]="{'highlighted' : highlighted}" dropdownToggle id="btn btn-group input-field-buton">
        <div class="content">
          <span class="text-balloon" *ngIf="value">
            {{ "{" + value + "}" }}
          </span>
        </div>
        <ngx-icon
          svgSrc="chevron-bold-down"
          class="chevron-bold-down"
        >
        </ngx-icon>
      </button>
      <div id="input-field-basic" *dropdownMenu class="dropdown-menu"
        aria-labelledby="input-field-button">
        <div class="dropdown-content">
          <div class="search-box-row">
            <app-form-builder-component-pdf-question-search-box>
            </app-form-builder-component-pdf-question-search-box>
          </div>
          <app-form-builder-component-pdf-question-tree>
          </app-form-builder-component-pdf-question-tree>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./input-field.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: false }}]
})
export class PdfInputFieldComponent implements OnInit {
  @Input() companyName;
  @Input() index;

  companies = [
    {
      id: 0,
      name: 'EZLynx',
      logo: 'assets/icons/svg/ezlynx-logo.svg',
      description: 'Auto Insurance',
      fieldCount: 4,
    }
  ]

  value = "";
  highlighted = false;

  constructor(
  ) {}

  ngOnInit(): void {
  }

  onDragOver($event) {
    this.highlighted = true;
  }

  onDragLeave($event) {
    this.highlighted = false;
  }

  onDrop($event) {
    this.value = $event.element.data.value;
    this.highlighted = false;
  }

  allowDrop(element) {
    return true;
  }
}
