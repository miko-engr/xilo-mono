import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'xilo-mono-intake-icon-snack-bar',
  template: '<div class="icon"><img src="{{ data?.icon}}" /> <span>{{ data?.message }}</span></div>',
  styleUrls: ['./icon-snack-bar.component.scss']
})
export class IconSnackBarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
