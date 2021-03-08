import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import {
  SubmissionService,
  VehicleListService,
} from '@xilo-mono/form-contracts';

@Component({
  selector: 'xilo-mono-form-viewer-input',
  templateUrl: './input.component.html',
  styleUrls: ['../../form-viewer.component.scss', './input.component.scss'],
})
export class CustomInputComponent extends FieldType {
  isInvalid = false;
  errorMessage = false;

  constructor(
    private submissionService: SubmissionService,
    private vehicleListService: VehicleListService
  ) {
    super();
  }

  updateMetadata(event: any) {
    if (this.to.type === 'email') {
      this.submissionService.onUpdateMetadata(
        {
          key: 'email',
          value: event.target.value,
        },
        this.field
      );
    } else if (this.to.dataKey === 'vin') {
      this.getVehicleDetailsByVIN(event.target.value);
    }
  }

  getError() {
    return 'Invalid response';
  }

  toType() {
    if (
      this.to.type === 'text' ||
      this.to.type === 'checkbox' ||
      this.to.type === 'number' ||
      this.to.type === 'date' ||
      this.to.type === 'email' ||
      this.to.type === 'password'
    ) {
      return this.to.type;
    } else {
      return 'text';
    }
  }

  getVehicleDetailsByVIN(vin: string) {
    // Get vehicle info including year, make and model from api
    if (!vin.length) return;
    if (vin.length === 17) {
      this.vehicleListService.getEZVehicleByVin(vin).subscribe((data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');

        // check for API response error
        if (
          xmlDoc.getElementsByTagName('Result')[0].innerHTML === 'VINNotFound'
        ) {
          // this.setErrormessage(
          //   'There was an issue with this VIN. Please enter vehicle manually'
          // );
        } else {
          let vinYear;
          let vinMake;
          let vinModel;
          let vinBodyStyle;
          if (xmlDoc.getElementsByTagName('Year')[0]) {
            vinYear = Number(xmlDoc.getElementsByTagName('Year')[0].innerHTML);
          }
          if (xmlDoc.getElementsByTagName('Make')[0]) {
            vinMake = xmlDoc.getElementsByTagName('Make')[0].innerHTML;
          }
          if (xmlDoc.getElementsByTagName('Model')[0]) {
            vinModel = xmlDoc.getElementsByTagName('Model')[0].innerHTML;
          }
          if (
            xmlDoc.getElementsByTagName('BodyStyle')[0] &&
            xmlDoc.getElementsByTagName('Drive') &&
            xmlDoc.getElementsByTagName('EngineInfo')
          ) {
            vinBodyStyle = `${
              xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML
            } ${xmlDoc.getElementsByTagName('Drive')[0].innerHTML} ${
              xmlDoc.getElementsByTagName('EngineInfo')[0].innerHTML
            }`;
          } else if (
            xmlDoc.getElementsByTagName('BodyStyle')[0] &&
            xmlDoc.getElementsByTagName('Drive')
          ) {
            vinBodyStyle = `${
              xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML
            } ${xmlDoc.getElementsByTagName('Drive')[0].innerHTML}`;
          } else if (
            xmlDoc.getElementsByTagName('BodyStyle')[0] &&
            xmlDoc.getElementsByTagName('EngineInfo')[0].innerHTML
          ) {
            vinBodyStyle = `${
              xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML
            } ${xmlDoc.getElementsByTagName('EngineInfo')[0].innerHTML}`;
          } else if (xmlDoc.getElementsByTagName('BodyStyle')[0]) {
            vinBodyStyle = `${
              xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML
            }`;
          }

          const vehicleYearField = this.field.parent.fieldGroup.find(
            (field) => {
              return field.templateOptions.dataKey === 'vehicleYear';
            }
          );
          if (vehicleYearField) {
            const vyf = vehicleYearField.formControl;
            vyf.patchValue(vinYear.toString().trim());
          }
          const vehicleMakeField = this.field.parent.fieldGroup.find(
            (field) => {
              return field.templateOptions.dataKey === 'vehicleMake';
            }
          );
          if (vehicleMakeField) {
            const vmf = vehicleMakeField.formControl;
            vmf.patchValue(vinMake.trim());
          }
          const vehicleModelField = this.field.parent.fieldGroup.find(
            (field) => {
              return field.templateOptions.dataKey === 'vehicleModel';
            }
          );
          if (vehicleModelField) {
            const vmof = vehicleModelField.formControl;
            vmof.patchValue(vinModel.trim());
          }
          const vehicleBodyStyleField = this.field.parent.fieldGroup.find(
            (field) => {
              return field.templateOptions.dataKey === 'vehicleBodyStyle';
            }
          );
          console.log(vehicleBodyStyleField);
          if (vehicleBodyStyleField) {
            const vbsF = vehicleBodyStyleField.formControl;
            vbsF.patchValue(vinBodyStyle.trim());
          }
        }
      });
    } else {
      // this.applicationService.formErrorsSource.next({
      //   message: 'Vehicle VIN should be 17 letter ID',
      //   type: 'warning'
      // });
    }
  }
}
