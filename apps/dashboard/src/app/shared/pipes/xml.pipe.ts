import beautify from 'xml-beautifier';

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'xml'
})
export class XmlPipe implements PipeTransform {
    transform(value: string): string {
        return beautify(value);
    }
}