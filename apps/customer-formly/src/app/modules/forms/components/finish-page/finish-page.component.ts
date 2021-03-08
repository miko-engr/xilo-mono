import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finish-page',
  templateUrl: './finish-page.component.html',
  styleUrls: ['./finish-page.component.scss']
})
export class FinishPageComponent implements OnInit {
  constructor(private router: Router) {}

  @Input() companyId: string;
  @Output() sendFormFinish: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {}
  submitForm() {
    this.sendFormFinish.emit();
    this.router.navigate(['/form/thank-you']);
  }
}
