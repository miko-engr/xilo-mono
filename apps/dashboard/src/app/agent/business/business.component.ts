import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
  isMobile: Boolean = false;
  constructor() {
    this.isModbileDevice(window.screen.width);
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const len = event.target.innerWidth;
    this.isModbileDevice(len);
  }

  isModbileDevice(len) {
    if (len && len < 600) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

}
