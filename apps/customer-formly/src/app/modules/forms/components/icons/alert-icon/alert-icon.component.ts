import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert-icon',
  templateUrl: './alert-icon.component.svg',
  styleUrls: ['./alert-icon.component.scss']
})
export class AlertIconComponent implements OnInit {
  constructor() {}
  @Input() typeOfAlert;

  ngOnInit(): void {}
}
