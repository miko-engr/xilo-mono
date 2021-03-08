// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
    <button type="button" (click)="onClick($event)">See more</button>
  `,
  styles: [
    `
      button {
        height: 1.5rem;
        width: auto;
        border-radius: 4px;
        background: white;
        color: #111;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: .6rem;
        border: 1px solid #111;
      }
    `,
  ],
})
export class ButtonRendererComponent implements ICellRendererAngularComp {
  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data,
        // ...something
      };
      this.params.onClick(params);
    }
  }
}
