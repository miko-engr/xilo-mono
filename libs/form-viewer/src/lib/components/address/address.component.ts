import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';


@Component({
  selector: 'xilo-mono-form-viewer-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss', '../../form-viewer.component.scss']
})
export class AddressComponent extends FieldType implements AfterViewInit {
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;

  googlePlacesOptions: Options = new Options({
    types: [],
    componentRestrictions: {
      country: 'US'
    }
  });

  handleAddressChange(address: Address) {

    const addressFieldKey = this.field.templateOptions.dataKey;
    
    const indexArray = address['address_components'].map(item => {
      return item.types[0];
    });

    const streetNumber = address['address_components'][
      indexArray.indexOf('street_number')
    ]
      ? address['address_components'][indexArray.indexOf('street_number')]
          .long_name
      : null;

    const streetName = address['address_components'][
      indexArray.indexOf('route')
    ]
      ? address['address_components'][indexArray.indexOf('route')].long_name
      : null;

    const streetAddress =
      streetNumber && streetName ? `${streetNumber} ${streetName}` : null;

    const city = address['address_components'][indexArray.indexOf('locality')]
      ? address['address_components'][indexArray.indexOf('locality')].long_name
      : null;

    const county = address['address_components'][
      indexArray.indexOf('administrative_area_level_2')
    ]
      ? address['address_components'][
          indexArray.indexOf('administrative_area_level_2')
        ].long_name
      : null;

    const state = address['address_components'][
      indexArray.indexOf('administrative_area_level_1')
    ]
      ? address['address_components'][
          indexArray.indexOf('administrative_area_level_1')
        ].short_name
      : null;

    const zipCode = address['address_components'][
      indexArray.indexOf('postal_code')
    ]
      ? address['address_components'][indexArray.indexOf('postal_code')]
          .long_name
      : null;

    const fullAddress = address['formatted_address'];

    this.formControl.patchValue(fullAddress);

    const streetNumberField = this.field.parent.fieldGroup.find(field => {
      return field.templateOptions.dataKey === (addressFieldKey + 'streetNumber');
    });

    if (streetNumberField) {
      streetNumberField.formControl.patchValue(streetNumber);
    }

    const streetNameField = this.field.parent.fieldGroup.find(field => {
      return field.templateOptions.dataKey === (addressFieldKey + 'streetName');
    });

    if (streetNameField) {
      streetNameField.formControl.patchValue(streetName);
    }

    const cityField = this.field.parent.fieldGroup.find(field => {
      return field.templateOptions.dataKey === (addressFieldKey + 'city');
    });

    if (cityField) {
      cityField.formControl.patchValue(city);
    }

    const stateField = this.field.parent.fieldGroup.find(field => {
      return field.templateOptions.dataKey === (addressFieldKey + 'state');
    });

    if (stateField) {
      stateField.formControl.patchValue(state);
    }

    const zipCodeField = this.field.parent.fieldGroup.find(field => {
      return field.templateOptions.dataKey === (addressFieldKey + 'zipCode');
    });

    if (zipCodeField) {
      zipCodeField.formControl.patchValue(zipCode);
    }

    const countyField = this.field.parent.fieldGroup.find(field => {
      return field.templateOptions.dataKey === (addressFieldKey + 'county');
    });

    if (countyField) {
      countyField.formControl.patchValue(county);
    }

    // if (!(streetNumber && streetName && city && state && zipCode)) {
    //   this.currentForm.get(answer.answerId).reset();
    //   this.applicationService.formErrorsSource.next({
    //     message:
    //       'Invalid address. Please try again (if you added a unit number in the autocomplete try it with out it)',
    //     type: 'warning'
    //   });
    //   setTimeout(() => {
    //     this.applicationService.formErrorsSource.next(null);
    //   }, 3500);
    //   return;
    // }


  }

  ngAfterViewInit(): void {
    this.setPlacesOptions();
  }

  private setPlacesOptions() {
    // Note: [options] for ngx-google-places-autocomplete conflicts with formly, so this must be done manually
    this.placesRef.options = this.googlePlacesOptions;
    this.placesRef.reset();
  }

}
