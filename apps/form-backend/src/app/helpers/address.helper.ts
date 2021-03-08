import * as addressParser from 'parse-address'; 

export const parseAddress = (address) => {
  if (!address) {
    return null;
  }
  return addressParser.parseLocation(address);
}