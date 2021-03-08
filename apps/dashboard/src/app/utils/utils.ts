export const formatDate = function (d) {
  if (!d) {
    return '';
  }
  d = new Date(d);
  const month = `0${(d.getMonth() + 1)}`;
  const day = `0${d.getDate()}`;
  const year = d.getFullYear();
  return [month.slice(-2), day.slice(-2), year].join('/');
};


export const getNextXDays = function (n) {
  const date = new Date();
  date.setDate(date.getDate() + n);

  return this.formatDate(date);
}

export const getFormData = function (obj) {
  const formData = new FormData();
  Object.keys(obj).forEach(function (key) {
    formData.append(key, obj[key]);
  });
  return formData;
}


export const activeFormsCopy = function (forms, vendor) {
  const formslist = JSON.parse(JSON.stringify(forms));
  const activeForms = formslist.filter(f => {
    return (f.integrations && f.integrations.length > 0 &&
      f.integrations.includes(vendor.vendorName));
  });
  return activeForms;
}

export const traverseAddress = function (results) {
  let state = null;
  let city = null;
  let country = null;
  let postal = null;
  let streetNumber = null;
  const getCountry = (addrComponents) => {
    for (let i = 0; i < addrComponents.length; i++) {
      if (addrComponents[i].types[0] === 'country') {
        return addrComponents[i].long_name;
      }
      if (addrComponents[i].types.length === 2) {
        if (addrComponents[i].types[0] === 'political') {
          return addrComponents[i].long_name;
        }
      }
    }
    return null;
  };
  const getState = (addrComponents) => {
    for (let i = 0; i < addrComponents.length; i++) {
      if (addrComponents[i].types[0] === 'administrative_area_level_1') {
        return addrComponents[i].long_name;
      }
    }
    return null;
  };
  const getCity = (addrComponents) => {
    for (let i = 0; i < addrComponents.length; i++) {
      if (addrComponents[i].types[0] === 'administrative_area_level_3' || addrComponents[i].types[0] === 'administrative_area_level_2') {
        return addrComponents[i].long_name;
      }
      if (addrComponents[i].types[0] === 'locality') {
        return addrComponents[i].long_name;
      }
    }
    return null;
  };
  const getPostal = (addrComponents) => {
    for (let i = 0; i < addrComponents.length; i++) {
      if (addrComponents[i].types[0] === 'postal_code') {
        return addrComponents[i].long_name;
      }
    }
    return null;
  };
  const getStreetNumber = (addrComponents) => {
    for (let i = 0; i < addrComponents.length; i++) {
      if (addrComponents[i].types[0] === 'street_number') {
        return addrComponents[i].long_name;
      }
    }
    return null;
  };
  results.forEach(r => {
    if (!country) {
      country = getCountry(r.address_components);
    }
    if (!state) {
      state = getState(r.address_components);
    }
    if (!city) {
      city = getCity(r.address_components);
    }
    if (!postal) {
      postal = getPostal(r.address_components);
    }
    if (!streetNumber) {
      streetNumber = getStreetNumber(r.address_components)
    }
  });
  return {
    state,
    city,
    country,
    postal,
    streetNumber
  };
}

export const formatAddress = function (address) {
  const data = address;
  const indexArray = data['address_components'].map(item => {
    return item.types[0];
  });
  const streetNumber = data['address_components'][indexArray.indexOf('street_number')] ?
    data['address_components'][indexArray.indexOf('street_number')].long_name : null;
  const streetName = data['address_components'][indexArray.indexOf('route')] ?
    data['address_components'][indexArray.indexOf('route')].long_name : null;
  const streetAddress = (streetNumber && streetName) ? `${streetNumber} ${streetName}` : null;
  const city = data['address_components'][indexArray.indexOf('locality')] ?
    data['address_components'][indexArray.indexOf('locality')].long_name : null;
  const county = data['address_components'][indexArray.indexOf('administrative_area_level_2')] ?
    data['address_components'][indexArray.indexOf('administrative_area_level_2')].long_name : null;
  const state = data['address_components'][indexArray.indexOf('administrative_area_level_1')] ?
    data['address_components'][indexArray.indexOf('administrative_area_level_1')].short_name : null;
  const zipCode = data['address_components'][indexArray.indexOf('postal_code')] ?
    data['address_components'][indexArray.indexOf('postal_code')].long_name : null;
  const fullAddress = `${streetNumber} ${streetName}, ${city}, ${state}, ${zipCode}`;
  return {
    streetNumber,
    streetName,
    streetAddress,
    city,
    state,
    county,
    zipCode,
    fullAddress
  };
}

export const formatPhoneNumber = function (phoneNumberString) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = (match[1] ? '+1 ' : '');
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
}

export const formatTonumber = function (number) {
  return number.replace(/\D/g, '');
}
