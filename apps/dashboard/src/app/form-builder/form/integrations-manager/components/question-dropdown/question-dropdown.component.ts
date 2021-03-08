import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { VendorIntegrationMappingService } from '../../services/vendorIntegrationMapping.service';

@Component({
  selector: 'app-form-builder-component-question-dropdown',
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
          <li role="menuitem"><a class="dropdown-item" href="#" (click)="resetIntegrationMapping($event)">Reset Integration Mapping</a></li>
        </ul>
      </div>
    </ng-container>
  `,
  styleUrls: ['./question-dropdown.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true }}]
})
export class QuestionDropdownComponent implements OnInit {
  constructor(private vendorIntegrationMappingService: VendorIntegrationMappingService) {}

  ngOnInit(): void {

  }

  resetIntegrationMapping($event) {
    $event.preventDefault();
    // this.vendorIntegrationMappingService.resetIntegrationMapping().subscribe();
  }

}
