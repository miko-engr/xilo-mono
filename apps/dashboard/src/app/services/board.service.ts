import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable()
export class BoardService {

  constructor() { }

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  reload() {
      this.change.emit(true);
  }
}
