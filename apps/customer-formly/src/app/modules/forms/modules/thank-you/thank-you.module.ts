import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThankYouRoutingModule } from './thank-you-routing.module';
import { SharedModule } from '../../../../../app/modules/shared/shared.module';
import { ThankYouComponent } from './thank-you.component';

@NgModule({
  declarations: [ThankYouComponent],
  imports: [CommonModule, SharedModule, ThankYouRoutingModule]
})
export class ThankYouModule {}
