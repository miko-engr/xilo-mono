import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
// import * as puppeteer from 'puppeteer';
import * as stringCompare from 'string-similarity';
import * as addressParser from 'parse-address';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
@Injectable()
export class UsDotIntegrationService {
  constructor(@Inject(REQUEST) private request: Request) {}
  async getDataByUSDOT() {
    //   TODO nothing application entity
    // try {
    //   const { usDotId } = this.request.params;
    //   const decoded = this.request.body.decodedUser;
    //   const application = await model.Application.findOne({
    //     where: { clientApplicationId: decoded.client.id },
    //   });
    //   const { responses } = application;
    //   const browser = await puppeteer.launch({
    //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
    //   });
    //   const page = await browser.newPage();
    //   await page.goto('https://safer.fmcsa.dot.gov/CompanySnapshot.aspx');
    //   await Promise.all([
    //     page.waitForSelector(
    //       'form > p > table > tbody >tr:nth-child(3) > td > input'
    //     ),
    //   ]);
    //   await page.$eval(
    //     'form > p > table > tbody >tr:nth-child(3) > td > input',
    //     (selector, usDotId) => {
    //       selector.value = usDotId;
    //     },
    //     usDotId
    //   );
    //   const searchBtn = await page.$(
    //     'form > p > table > tbody >tr:nth-child(4) > td > input'
    //   );
    //   await searchBtn.click();
    //   await page.waitForNavigation();
    //   const newText = await page.evaluate(() =>
    //     Array.from(
    //       document.querySelectorAll('center > table > tbody > tr'),
    //       (element) => element.textContent
    //     )
    //   );
    //   const itemArr = [];
    //   for (let i = 0, item; (item = newText[i]); i++) {
    //     const itemJSON = { key: null, value: null };
    //     if (item) {
    //       item = item.replace(/(\r\n|\n|\r)/gm, '');
    //       item = item.replace(/\s+/g, ' ').trim();
    //     }
    //     if (item && item !== 'SAFER Layout') {
    //       let newItemArr;
    //       const itemHasSafarLayout = item.includes('SAFER Layout');
    //       if (itemHasSafarLayout) {
    //         newItemArr = item.split('SAFER Layout');
    //         const isX = newItemArr[1] ? newItemArr[1].includes(' X ') : '';
    //         if (newItemArr[1] && isX) {
    //           otherArr = newItemArr[1].replace(' X ', '');
    //           newItemArr[1] = otherArr;
    //         }
    //       } else {
    //         newItemArr = item.split(':');
    //         const isX = newItemArr[1] ? newItemArr[1].includes(' X ') : '';
    //         if (newItemArr[1] && isX) {
    //           otherArr = newItemArr[1].replace(' X ', ' | ');
    //           newItemArr[1] = otherArr;
    //         }
    //       }
    //       itemJSON.key = newItemArr[0];
    //       itemJSON.value = newItemArr[1];
    //       if (
    //         typeof itemJSON.value !== 'undefined' &&
    //         itemJSON.value &&
    //         itemJSON.value !== ''
    //       ) {
    //         itemJSON.key = itemJSON.key.replace(/\s+$/g, '');
    //         itemJSON.value = itemJSON.value.replace(/^\s+/g, '');
    //         for (let i = 0, response; (response = responses[i]); i++) {
    //           if (response.usDotKey) {
    //             if (
    //               stringCompare.compareTwoStrings(
    //                 itemJSON.key,
    //                 response.usDotKey
    //               ) >= 0.8
    //             ) {
    //               response.value = itemJSON.value;
    //             }
    //           }
    //         }
    //         itemArr.push(itemJSON);
    //       }
    //     }
    //   }
    //   /*
    //             */
    //   // await page.screenshot({path: 'example.png'});
    //   await browser.close();
    //   const updatedApplication = await application.update({ responses });
    //   req.session.data = {
    //     title: 'Data retrieved successfully',
    //     arr: itemArr,
    //     updatedApplication,
    //     application,
    //   };
    //   return next();
    // } catch (error) {
    //   return next(Boom.badRequest('Error retrieving USDOT info'));
    // }
  }
  async getDataByUSDOTV2() {
  //   try {
  //     const { usDotId } = this.request.params;
  //     const business: any = {};

  //     const browser = await puppeteer.launch({
  //       args: ['--no-sandbox', '--disable-setuid-sandbox'],
  //     });
  //     const page = await browser.newPage();
  //     await page.goto('https://safer.fmcsa.dot.gov/CompanySnapshot.aspx');

  //     await Promise.all([
  //       page.waitForSelector(
  //         'form > p > table > tbody >tr:nth-child(3) > td > input'
  //       ),
  //     ]);

  //     await page.$eval(
  //       'form > p > table > tbody >tr:nth-child(3) > td > input',
  //       (selector, usDotId) => {
  //         selector.nodeValue = usDotId;
  //       },
  //       usDotId
  //     );

  //     const searchBtn = await page.$(
  //       'form > p > table > tbody >tr:nth-child(4) > td > input'
  //     );

  //     await searchBtn.click();

  //     await page.waitForNavigation();

  //     const newText = await page.evaluate(() =>
  //       Array.from(
  //         document.querySelectorAll('center > table > tbody > tr'),
  //         (element) => element.textContent
  //       )
  //     );

  //     const itemArr = [];
  //     for (let i = 0, item; (item = newText[i]); i++) {
  //       const itemJSON = { key: null, value: null };
  //       if (item) {
  //         item = item.replace(/(\r\n|\n|\r)/gm, '');
  //         item = item.replace(/\s+/g, ' ').trim();
  //       }
  //       if (item && item !== 'SAFER Layout') {
  //         let newItemArr;
  //         const itemHasSafarLayout = item.includes('SAFER Layout');
  //         if (itemHasSafarLayout) {
  //           newItemArr = item.split('SAFER Layout');
  //           const isX = newItemArr[1] ? newItemArr[1].includes(' X ') : '';
  //           if (newItemArr[1] && isX) {
  //             const otherArr = newItemArr[1].replace(' X ', '');
  //             newItemArr[1] = otherArr;
  //           }
  //         } else {
  //           newItemArr = item.split(':');
  //           const isX = newItemArr[1] ? newItemArr[1].includes(' X ') : '';
  //           if (newItemArr[1] && isX) {
  //             const otherArr = newItemArr[1].replace(' X ', ' | ');
  //             newItemArr[1] = otherArr;
  //           }
  //         }
  //         itemJSON.key = newItemArr[0];
  //         itemJSON.value = newItemArr[1];
  //         if (
  //           typeof itemJSON.value !== 'undefined' &&
  //           itemJSON.value &&
  //           itemJSON.value !== ''
  //         ) {
  //           itemJSON.key = itemJSON.key.replace(/\s+$/g, '');
  //           itemJSON.value = itemJSON.value.replace(/^\s+/g, '');
  //           if (itemJSON.key === 'Physical Address' && addressParser) {
  //             const address = addressParser.parseLocation(itemJSON.value);
  //             if (address) {
  //               function returnWithSpace(value) {
  //                 return value && value !== '' ? ` ${value}` : '';
  //               }
  //               business.streetAddress = `${address.number}${returnWithSpace(
  //                 address.prefix
  //               )}${address.street}${returnWithSpace(address.type)}`;
  //               business.streetNumber = address.number;
  //               business.streetName = `${address.street}${returnWithSpace(
  //                 address.type
  //               )}`;
  //               business.city = address.city;
  //               business.state = address.state;
  //               business.zipCode = address.zip;
  //             }
  //           } else if (itemJSON.key === 'Entity Type') {
  //             business['businessType'] = itemJSON.value;
  //           } else if (itemJSON.key === 'Operating Status') {
  //           } else if (itemJSON.key === 'Legal Name') {
  //             business['entityName'] = itemJSON.value;
  //           } else if (itemJSON.key === 'Phone') {
  //             business['phone'] = itemJSON.value;
  //           } else if (itemJSON.key === 'Mailing Address') {
  //           } else if (itemJSON.key === 'MC/MX/FF Number(s)') {
  //             business['MCMXFFNumbers'] = itemJSON.value;
  //           } else if (itemJSON.key === 'MCS-150 Form Date') {
  //           } else if (itemJSON.key === 'Operation Classification') {
  //           } else if (itemJSON.key === 'Carrier Operation') {
  //           } else if (itemJSON.key === 'Cargo Carried') {
  //             business['cargo'] = itemJSON.value;
  //           }
  //           itemArr.push(itemJSON);
  //         }
  //       }
  //     }

  //     await browser.close();

  //     return {
  //       title: 'Data retrieved successfully',
  //       arr: itemArr,
  //       business: business,
  //     };
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  }
}
