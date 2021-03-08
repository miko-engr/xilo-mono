import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as request from 'request-promise';
import * as stringSimilarity from 'string-similarity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Answers } from '../../entities/Answers'; // TODO should be imported from Answers module
@Injectable()
export class EstatedService {
  constructor(
    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>
  ) {}
  async getPropertyData(bodyData: any) {
    try {
      let addressData = bodyData.addressData;
      let homeObject = bodyData.homeObject;
      let queryParams = bodyData.queryParams;
      let answers;
      if (!queryParams || !queryParams.formId) {
        answers = bodyData.answers;
      } else {
        answers = await this.answersRepository.find({
          where: { id: queryParams.formId },
        });
        if (!answers) {
          throw new HttpException('No found answers', HttpStatus.BAD_REQUEST);
        }
      }

      let data = await getEstatedData();
      let returnObject = await setHomeData();

      async function getEstatedData() {
        let unitNumber = addressData.unitNumber || null;
        let newStreetName = addressData.streetName.replace(' ', '+');
        let address =
          (unitNumber !== undefined && unitNumber !== null && unitNumber !== ''
            ? `${unitNumber}+`
            : '') +
          addressData.streetNumber +
          '+' +
          newStreetName;
        let newCity = `,${addressData.city.replace(' ', '+')}`;
        let stateZip = `,${addressData.state + '+' + addressData.zipCode}`;

        const options = {
          method: 'GET',
          url: `https://apis.estated.com/v4/property?token=${
            process.env.ESTATED_API_KEY
          }&combined_address=${address + newCity + stateZip}`,
          json: true,
        };

        return await request(options);
      }

      async function matchProperties(key, estatedValue) {
        const match = await onMatchProperties(estatedValue, key);
        if (match) {
          homeObject[key] = match;
        }
      }

      async function setHomeData() {
        if (data !== null && !data.error) {
          let geoObject = {
            latitude: null,
            longitude: null,
          };

          const values = returnExists(data.data) ? data.data : {};
          const property = returnExists(values.structure)
            ? values.structure
            : {};
          const land = returnExists(values.parcel) ? values.parcel : {};
          if (returnExists(land.area_acres)) {
            await matchProperties('acres', land.area_acres);
          }

          if (returnExists(property.year_built)) {
            await matchProperties('yearBuilt', property.year_built);
          } else if (returnExists(property.effective_year_built)) {
            await matchProperties('yearBuilt', property.effective_year_built);
          }
          if (returnExists(property.stories)) {
            await matchProperties('numOfStories', property.stories);
          }
          if (returnExists(land.standardized_land_use_type)) {
            await matchProperties(
              'structureType',
              land.standardized_land_use_type
            );
          }
          if (returnExists(property.total_area_sq_ft)) {
            await matchProperties(
              'totalSquareFootage',
              property.total_area_sq_ft
            );
          }
          if (returnExists(property.roof_material_type)) {
            await matchProperties('roofType', property.roof_material_type);
          }
          if (returnExists(property.beds_count)) {
            await matchProperties('numOfBeds', property.beds_count);
          }
          if (returnExists(property.baths)) {
            await matchProperties('numOfBaths', property.baths);
          }

          if (
            property.parking_type &&
            property.parking_type.toLowerCase() &&
            property.parking_type.toLowerCase().includes('garage')
          ) {
            await matchProperties('garageType', property.parking_type);
            if (answers.some((ans) => ans.propertyKey === 'hasGarage')) {
              homeObject['hasGarage'] = true;
            } else if (
              answers.some((ans) => ans.propertyKey === 'homeHasGarage')
            ) {
              homeObject['homeHasGarage'] = 'Yes';
            }
          } else {
            if (answers.some((ans) => ans.propertyKey === 'hasGarage')) {
              homeObject['hasGarage'] = false;
            } else if (
              answers.some((ans) => ans.propertyKey === 'homeHasGarage')
            ) {
              homeObject['homeHasGarage'] = 'No';
            }
          }

          if (
            returnExists(property.other_areas) &&
            property.other_areas.length
          ) {
            property.other_areas.forEach((area) => {
              if (area.type.toLowerCase().indexOf('garage') !== -1) {
                homeObject['hasGarage'] = true;
                homeObject['homeHasGarage'] = 'Yes';
                if (area.sq_ft > 0) {
                  let garageS = Math.round(+area.sq_ft / 550);
                  matchProperties('garageSizeByCar', garageS.toString());
                } else {
                  matchProperties('garageSizeByCar', '0');
                }
              }
            });
          }

          if (returnExists(property.fireplaces)) {
            if (+property.fireplaces > 0) {
              homeObject['hasFireplace'] = 'Yes';
              await matchProperties('numberOfFireplaces', property.fireplaces);
            } else {
              homeObject['hasFireplace'] = 'No';
            }
          }
          if (returnExists(property.foundation_type)) {
            await matchProperties(
              'homeFoundationType',
              property.foundation_type
            );
          }
          if (returnExists(property.basement_type)) {
            if (property.basement_type.toLowerCase() === 'finished') {
              homeObject['homeHasBasement'] = 'Yes';
              homeObject['hasBasement'] = true;
              await matchProperties('basementType', '75');
            } else if (property.basement_type.toLowerCase() === 'crawl-space') {
              homeObject['homeHasBasement'] = 'No';
              homeObject['hasBasement'] = false;
              await matchProperties(
                'homeFoundationType',
                property.basement_type
              );
            } else if (
              property.basement_type.toLowerCase() === 'partially finished'
            ) {
              homeObject['homeHasBasement'] = 'Yes';
              homeObject['hasBasement'] = true;
              await matchProperties('basementType', '25');
            } else if (property.basement_type.toLowerCase() === 'unfinished') {
              homeObject['homeHasBasement'] = 'Yes';
              homeObject['hasBasement'] = true;
              await matchProperties('basementType', '10');
            } else if (
              property.basement_type.toLowerCase() === 'completely finished'
            ) {
              homeObject['homeHasBasement'] = 'Yes';
              homeObject['hasBasement'] = true;
              await matchProperties('basementType', '100');
            }
          }
          if (returnExists(property.exterior_wall_type)) {
            await matchProperties(
              'exteriorMaterials',
              property.exterior_wall_type
            );
          }
          if (returnExists(property.pool_type)) {
            await matchProperties('poolType', property.pool_type);
            homeObject['hasPools'] = 'Yes';
          } else {
            homeObject['hasPools'] = 'No';
          }
          if (returnExists(property.heating_type)) {
            await matchProperties('heatType', property.heating_type);
          }
          if (returnExists(property.air_conditioning_type)) {
            await matchProperties('coolType', property.air_conditioning_type);
          }
          if (returnExists(property.quality)) {
            let quality = property.quality.replace('+', '');
            if (
              quality.toLowerCase() === 'd' ||
              quality.toLowerCase() === 'e'
            ) {
              homeObject['levelOfFinishes'] = '1';
            } else if (
              quality.toLowerCase() === 'b' ||
              quality.toLowerCase() === 'c'
            ) {
              homeObject['levelOfFinishes'] = '2';
            } else if (quality.toLowerCase() === 'a') {
              homeObject['levelOfFinishes'] = '3';
            }
          }
          if (
            returnExists(values.valuation) &&
            returnExists(values.valuation.value)
          ) {
            homeObject['marketValue'] = values.valuation.value;
          }
          if (
            returnExists(values.deeds) &&
            values.deeds.length > 0 &&
            returnExists(values.deeds[values.deeds.length - 1])
          ) {
            if (
              returnExists(values.deeds[values.deeds.length - 1].sale_price)
            ) {
              homeObject['purchasePrice'] =
                values.deeds[values.deeds.length - 1].sale_price;
              if (
                returnExists(
                  values.deeds[values.deeds.length - 1].recording_date
                )
              ) {
                homeObject['moveInDate'] =
                  values.deeds[values.deeds.length - 1].recording_date;
              }
            }
          }
          if (returnExists(values.address)) {
            if (returnExists(values.address.latitude)) {
              geoObject.latitude = values.address.latitude;
            }
            if (returnExists(values.address.longitude)) {
              geoObject.longitude = values.address.longitude;
            }
          }
          if (returnExists(property.units_count)) {
            if (+property.units_count === 1) {
              await matchProperties('residenceType', 'One');
            } else if (+property.units_count === 2) {
              await matchProperties('residenceType', 'Two');
            } else if (+property.units_count === 3) {
              await matchProperties('residenceType', 'Three');
            } else if (+property.units_count === 4) {
              await matchProperties('residenceType', 'Four');
            }
          }

          return {
            homeObject: homeObject,
            geoObject: geoObject,
            success: true,
          };
        } else
          return {
            success: false,
          };
      }

      function stripString(string) {
        return string.replace(/[^\d-]/g, '');
      }

      async function onMatchProperties(value, key) {
        const lowerCaseValue = value.toString().toLowerCase();
        if (
          value &&
          key &&
          answers &&
          answers[0] &&
          answers.some((answer) => answer.propertyKey === key)
        ) {
          let i = answers.findIndex((answer) => answer.propertyKey === key);
          if (i > -1) {
            let answer = answers[i];
            if (key === 'coolType' && value === 'Yes') {
              return returnBestMatch('Central AC - Same Ducts', answer.options);
            } else if (key === 'heatType' && lowerCaseValue === 'steam') {
              return returnBestMatch('Gas - Forced Air', answer.options);
            } else if (key === 'numOfStories') {
              if (value.length === 1 && !isNaN(value)) {
                return value;
              } else if (value.lenghth === 3 && value.includes('.')) {
                return returnBestMatch(value, answer.options);
              } else {
                value = stripString(value);
                return returnBestMatch(value, answer.options);
              }
            }
            if (answer.options && answer.options[0]) {
              if (typeof value === 'number') {
                return await returnClosestNumberValue(value, answer.options);
              }
              return returnBestMatch(value, answer.options);
            } else {
              return value;
            }
          }
        } else {
          return value;
        }
      }

      function returnBestMatch(value, array) {
        const lowerCaseValue = value.toLowerCase();
        if (
          typeof array != 'undefined' &&
          array &&
          array !== [] &&
          array.length &&
          array.length !== 0
        ) {
          const lowerCaseArray = array.map((arr) => arr.toLowerCase());
          const bestMatchData = stringSimilarity.findBestMatch(
            lowerCaseValue,
            lowerCaseArray
          );
          if (bestMatchData.bestMatch && bestMatchData.bestMatch.rating > 0.5) {
            return array[bestMatchData.bestMatchIndex];
          } else {
            return null;
          }
        } else {
          return value;
        }
      }

      async function returnClosestNumberValue(value, array) {
        try {
          async function returnValueIfExists(val) {
            if (
              val &&
              val !== 'undefined' &&
              typeof val !== 'undefined' &&
              val !== null
            ) {
              return val;
            }
            return null;
          }
          const returnBestValue = async (arr, val) => {
            try {
              if (returnValueIfExists(val)) {
                if (isNaN(val)) {
                  return null;
                } else {
                  const bestValue = arr.reduce(function (prev, curr) {
                    return Math.abs(curr - val) < Math.abs(prev - val)
                      ? curr
                      : prev;
                  });
                  return bestValue ? bestValue.toString() : null;
                }
              } else {
                return val;
              }
            } catch (error) {
              return null;
            }
          };

          const bestValue = await returnBestValue(array, value);
          return bestValue;
        } catch (error) {
          return null;
        }
      }

      function returnExists(value) {
        return (
          (value !== undefined && value !== null && value !== '') ||
          value === false
        );
      }

      return returnObject;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
