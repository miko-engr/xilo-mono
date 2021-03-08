import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

import { Answer } from '../../models';

@Component({
  selector: 'app-educational-dropdown',
  templateUrl: './educational-dropdown.component.html',
  styleUrls: ['./educational-dropdown.component.scss'],
  animations: [
    trigger('questionDropDown', [
      state('small', style({ height: '0' })),
      state('large', style({ height: '150px' })),
      transition('small <=> large', animate('200ms ease-in'))
    ])
  ]
})
export class EducationalDropdownComponent implements OnInit {
  public imgSource = 'keyboard_arrow_down_32px.svg';
  state = 'small';

  @Input() properties: Answer;
  @ViewChild('imageModal') modalElementRef: ElementRef;
  closeAnimation: boolean;

  constructor() {}

  ngOnInit(): void {}

  expandEducationalDropdown() {
    this.state = this.state === 'small' ? 'large' : 'small';

    if (this.state === 'small') {
      this.imgSource = 'keyboard_arrow_down_32px.svg';
    } else {
      this.imgSource = 'keyboard_arrow_up_32px.svg';
    }
  }
  handleImageClick(event) {
    this.closeAnimation = false;

    this.modalElementRef.nativeElement.children[1].src = event.toElement.src;
    this.modalElementRef.nativeElement.style.display = 'block';
  }

  closeModal() {
    this.closeAnimation = true;
    setTimeout(() => {
      this.modalElementRef.nativeElement.style.display = 'none';
    }, 500);
  }
}
