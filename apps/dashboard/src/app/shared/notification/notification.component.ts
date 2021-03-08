import { Component, OnInit, Input, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @Input() data: {type: string , message: string};
  constructor() {
   }

  ngOnInit(): void {
  }
}
