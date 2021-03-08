import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilderService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'app-form-builder-component-pdf-question-search-box',
  template: `
    <ng-container>
      <div class="question-search-box">
        <ngx-icon svgSrc="search" class="search-icon"> </ngx-icon>
        <input
          type="text"
          (keyup)="onSearch()"
          [(ngModel)]="searchValue"
          class="search-input"
          placeholder="{{ placeholder }}"
        />
      </div>
    </ng-container>
  `,
  styleUrls: ['./question-search-box.scss'],
})
export class PdfQuestionSearchBoxComponent implements OnInit {
  placeholder = 'Start typing question title...';
  searchValue = '';

  constructor(
    private formBuilderService: FormBuilderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formBuilderService.onSearchQuestion('');
  }

  onSearch() {
    this.formBuilderService.onSearchQuestion(this.searchValue);
  }
}
