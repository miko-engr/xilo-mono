import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { of, Observable } from 'rxjs';
import { Answer } from '../models';
import * as stringSimilarity from 'string-similarity';
import { switchMap } from 'rxjs/operators';

export class HomeObject {
  success: boolean;
  geoObject?:any;
  homeObject?: any
}

@Injectable()
export class ApiService {
  answers = [];
  homeObject = {};

  constructor(private http: HttpClient) {}

  /*
   *
   * Home Value API (Estated)
   *
   */

  // getPropertyData(
  //   addressData,
  //   this.homeObject,
  //   queryParams
  // ) {
  //   return this.http.post(
  //     `${
  //         BASE_URL
  //       }estated/getPropertyData`, {
  //         addressData: addressData,
  //         this.homeObject: this.homeObject,
  //         queryParams: queryParams
  //       }
  //   );
  // }

  getPropertyData(
    addressData,
    answers: Answer[]
  ): Observable<HomeObject> {
    this.answers = answers;
    return this.getHomeData(addressData)
    .pipe(
      switchMap(res => of(this.setHomeData(res)))
    );
  }

  getHomeData(addressData) {
    const unitNumber = addressData.unitNumber || null;
    const newStreetName = addressData.streetName.replace(' ', '+');
    const address = ((
      unitNumber !== undefined && 
      unitNumber !== null && 
      unitNumber !== '') ? 
      `${unitNumber}+` : ''
      ) + 
      addressData.streetNumber + 
      '+' + 
      newStreetName;
    const newCity = `,${addressData.city.replace(' ', '+')}`;
    const stateZip = `,${addressData.state + '+' + addressData.zipCode}`;
    return this.http.get(
      `https://apis.estated.com/v4/property?token=${
        environment.estatedAPIKey
      }&combined_address=${
        address + newCity + stateZip
      }`
    );
  }

  returnExists(value) {
    return (value !== undefined && value !== null && value !== "") || value === false;
  }

  matchProperties(key, estatedValue) {
    const match = this.onMatchProperties(estatedValue, key);
    if (match) {
      this.homeObject[key] = match;
    }
  }

  setHomeData(data): HomeObject {
    if (data !== null && !data.error) {
      let geoObject = {
        latitude: null,
        longitude: null
      };

      const values = this.returnExists(data.data) ? data.data : {};
      const property = this.returnExists(values.structure) ? values.structure : {};
      const land = this.returnExists(values.parcel) ? values.parcel : {};
      if (this.returnExists(land.area_acres)) {
          this.matchProperties('acres', land.area_acres)
      }

      if (this.returnExists(property.year_built)) {
          this.matchProperties('yearBuilt', property.year_built);
      } else if (this.returnExists(property.effective_year_built)) {
          this.matchProperties('yearBuilt', property.effective_year_built);
      }
      if (this.returnExists(property.stories)) {
          this.matchProperties('numOfStories', property.stories);
      }
      if (this.returnExists(land.standardized_land_use_type)) {
          this.matchProperties('structureType', land.standardized_land_use_type);
      }
      if (this.returnExists(property.total_area_sq_ft)) {
          this.matchProperties('totalSquareFootage', property.total_area_sq_ft);
      }
      if (this.returnExists(property.roof_material_type)) {
          this.matchProperties('roofType', property.roof_material_type);
      }
      if (this.returnExists(property.beds_count)) {
          this.matchProperties('numOfBeds', property.beds_count);
      }
      if (this.returnExists(property.baths)) {
          this.matchProperties('numOfBaths', property.baths);
      }

      if (property.parking_type && property.parking_type.toLowerCase() && property.parking_type.toLowerCase().includes('garage')) {
          this.matchProperties('garageType', property.parking_type);
        if (this.answers.some(ans => ans.propertyKey === 'hasGarage')) {
          this.homeObject['hasGarage'] = true;
        } else if (this.answers.some(ans => ans.propertyKey === 'homeHasGarage')) {
          this.homeObject['homeHasGarage'] = 'Yes';
        }
      } else {
        if (this.answers.some(ans => ans.propertyKey === 'hasGarage')) {
          this.homeObject['hasGarage'] = false;
        } else if (this.answers.some(ans => ans.propertyKey === 'homeHasGarage')) {
          this.homeObject['homeHasGarage'] = 'No';
        }
      }


      if (this.returnExists(property.other_areas) && property.other_areas.length) {
        property.other_areas.forEach(area => {
          if (area.type.toLowerCase().indexOf("garage") !== -1) {
            this.homeObject['hasGarage'] = true;
            this.homeObject['homeHasGarage'] = 'Yes';
            if (area.sq_ft > 0) {
              let garageS = Math.round(+area.sq_ft / 550);
                this.matchProperties('garageSizeByCar', garageS.toString());
            }
            else {
                this.matchProperties('garageSizeByCar', '0');
            }
          }
        });
      }

      if (this.returnExists(property.fireplaces)) {
        if (+property.fireplaces > 0) {
          this.homeObject['hasFireplace'] = 'Yes';
            this.matchProperties('numberOfFireplaces', property.fireplaces);
        } else {
          this.homeObject['hasFireplace'] = 'No';
        }
      }
      if (this.returnExists(property.foundation_type)) {
          this.matchProperties('homeFoundationType', property.foundation_type);
      }
      if (this.returnExists(property.basement_type)) {
        if (property.basement_type.toLowerCase() === 'finished') {
          this.homeObject['homeHasBasement'] = 'Yes';
          this.homeObject['hasBasement'] = true;
            this.matchProperties('basementType', '75');
        } else if (property.basement_type.toLowerCase() === 'crawl-space') {
          this.homeObject['homeHasBasement'] = 'No';
          this.homeObject['hasBasement'] = false;
            this.matchProperties('homeFoundationType', property.basement_type);
        } else if (property.basement_type.toLowerCase() === 'partially finished') {
          this.homeObject['homeHasBasement'] = 'Yes';
          this.homeObject['hasBasement'] = true;
            this.matchProperties('basementType', '25');
        } else if (property.basement_type.toLowerCase() === 'unfinished') {
          this.homeObject['homeHasBasement'] = 'Yes';
          this.homeObject['hasBasement'] = true;
            this.matchProperties('basementType', '10');
        } else if (property.basement_type.toLowerCase() === 'completely finished') {
          this.homeObject['homeHasBasement'] = 'Yes';
          this.homeObject['hasBasement'] = true;
            this.matchProperties('basementType', '100');
        }
      }
      if (this.returnExists(property.exterior_wall_type)) {
          this.matchProperties('exteriorMaterials', property.exterior_wall_type);
      }
      if (this.returnExists(property.pool_type)) {
          this.matchProperties('poolType', property.pool_type);
        this.homeObject['hasPools'] = 'Yes';
      } else {
        this.homeObject['hasPools'] = 'No';
      }
      if (this.returnExists(property.heating_type)) {
          this.matchProperties('heatType', property.heating_type);
      }
      if (this.returnExists(property.air_conditioning_type)) {
          this.matchProperties('coolType', property.air_conditioning_type);
      }
      if (this.returnExists(property.quality)) {
        let quality = property.quality.replace("+", "");
        if (quality.toLowerCase() === 'd' || quality.toLowerCase() === 'e') {
          this.homeObject['levelOfFinishes'] = '1';
        } else if (quality.toLowerCase() === 'b' || quality.toLowerCase() === 'c') {
          this.homeObject['levelOfFinishes'] = '2';
        } else if (quality.toLowerCase() === 'a') {
          this.homeObject['levelOfFinishes'] = '3';
        }
      }
      if (this.returnExists(values.valuation) && this.returnExists(values.valuation.value)) {
        this.homeObject['marketValue'] = values.valuation.value;
      }
      if (this.returnExists(values.deeds) && values.deeds.length > 0 && this.returnExists(values.deeds[values.deeds.length - 1])) {
        if (this.returnExists(values.deeds[values.deeds.length - 1].sale_price)) {
          this.homeObject['purchasePrice'] = values.deeds[values.deeds.length - 1].sale_price;
          if (this.returnExists(values.deeds[values.deeds.length - 1].recording_date)) {
            this.homeObject['moveInDate'] = values.deeds[values.deeds.length - 1].recording_date;
          }
        }
      }
      // if (this.returnExists(land.standardized_land_use_category)) {
      //   this.homeObject['residenceType'] = land.standardized_land_use_category;
      // }
      // if (this.returnExists(land.standardized_land_use_type)) {
      //   this.homeObject['homeType'] = land.standardized_land_use_type;
      // }
      if (this.returnExists(values.address)) {
        if (this.returnExists(values.address.latitude)) {
          geoObject.latitude = values.address.latitude;
        }
        if (this.returnExists(values.address.longitude)) {
          geoObject.longitude = values.address.longitude;
        }
      }
      if (this.returnExists(property.units_count)) {
        if (+property.units_count === 1) {
          this.matchProperties('residenceType', 'One');
        } else if (+property.units_count === 2) {
          this.matchProperties('residenceType', 'Two');
        } else if (+property.units_count === 3) {
          this.matchProperties('residenceType', 'Three');
        } else if (+property.units_count === 4) {
          this.matchProperties('residenceType', 'Four');
        }
      }

      return {
        homeObject: this.homeObject,
        geoObject: geoObject,
        success: true
      }
    } else return {
      success: false
    }
  }

  stripString(string) {
    return string.replace(/[^\d-]/g, '');
  }

  onMatchProperties(value, key) {
    const lowerCaseValue = value.toString().toLowerCase();
    if (value && key && this.answers && this.answers[0] && this.answers.some(answer => answer.propertyKey === key)) {
      let i = this.answers.findIndex(answer => answer.propertyKey === key);
      if (i > -1) {
        const answer = this.answers[i];
        if (key === 'coolType' && value === 'Yes') {
          return this.returnBestMatch('Central AC - Same Ducts', answer.options);
        } else if (key === 'heatType' && lowerCaseValue === 'steam') {
          return this.returnBestMatch('Gas - Forced Air', answer.options);
        } else if (key === 'numOfStories') {
          if (value.length === 1 && !isNaN(value)) {
            return value;
          } else if (value.lenghth === 3 && value.includes('.')) {
            return this.returnBestMatch(value, answer.options);
          } else {
            value = this.stripString(value);
            return this.returnBestMatch(value, answer.options);
          }
        }
        if (answer.options && answer.options[0]) {
          if (typeof value === 'number') {
            return this.returnClosestNumberValue(value, answer.options, null);
          }
          return this.returnBestMatch(value, answer.options);
        } else {
          return value;
        }
      }
    }
  }

  returnBestMatch(value, array) {
    const lowerCaseValue = value.toLowerCase();
    if (typeof array != 'undefined' && array && array !== [] && (array.length && array.length !== 0)) {
      const lowerCaseArray = array.map(arr => arr.toLowerCase());
      const bestMatchData = stringSimilarity.findBestMatch(lowerCaseValue, lowerCaseArray);
      if (bestMatchData.bestMatch && bestMatchData.bestMatch.rating > .5) {
        return array[bestMatchData.bestMatchIndex];
      } else {
        return null;
      }
    } else {
      return value;
    }
  }

  returnClosestNumberValue(value, array, defaultValue) {
    try {
      
      function returnValueIfExists(val) {
        if (val && val !== 'undefined' && typeof val !== 'undefined' && val !== null) {
          return val;
        }
        return null;
      }
      const returnBestValue = 
      (arr, val) => {
        try {
          if (returnValueIfExists(val)) {
            if (isNaN(val)) {
              return null;
            } else {
              const bestValue = arr.reduce(function(prev, curr) {
                return (Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
              });
              return bestValue ? bestValue.toString() : null;
            }
          } else {
            return val
          }
        } catch (error) {
          return null;
        }
      };

      const bestValue = returnBestValue(array, value);
      return bestValue;
    } catch(error) {
      return null;
    }
  };

}
