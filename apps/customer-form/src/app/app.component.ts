import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  ngOnInit() {
    window.addEventListener('message', event => {
      if(event.data.ref) localStorage.setItem('ref', event.data.ref)
    });
  }
}
