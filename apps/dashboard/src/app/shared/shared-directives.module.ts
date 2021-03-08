import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafePipe } from './pipes/safe.pipe';
import { XmlPipe } from './pipes/xml.pipe';

@NgModule({
    declarations: [
        SafePipe,
        XmlPipe
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        SafePipe,
        XmlPipe
    ]
})

export class SharedDirectiveModule {}

