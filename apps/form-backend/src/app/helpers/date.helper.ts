import * as moment from 'moment';
export const formatDate = (d) => {
  if (!d) {
    return '';
  }
  d = new Date(d);
  const month = `0${d.getMonth() + 1}`;
  const day = `0${d.getDate()}`;
  const year = d.getFullYear();
  return [month.slice(-2), day.slice(-2), year].join('/');
};

export const formatDateYYMMDD = (d) => {
  if (!d) {
    return '';
  }
  d = new Date(d);
  const month = `0${d.getMonth() + 1}`;
  const day = `0${d.getDate()}`;
  let year = d.getFullYear();
  if (year == 20) {
    year = 2020;
  }
  if (!(year && month && day) || (isNaN(year) || isNaN(month as any) || isNaN(day as any))) {
    return '';
  }
  year = year.toString().substring(4, 2);
  return [year, month.slice(-2), day.slice(-2)].join('');
};

export const formatDateMMYY = (d) => {
  if (!d) {
    return '';
  }
  d = new Date(d);
  const month = `0${d.getMonth() + 1}`;
  const day = `0${d.getDate()}`;
  let year = d.getFullYear();
  if (year == 20) {
    year = 2020;
  }
  if (!(year && month && day) || (isNaN(year) || isNaN(month as any) || isNaN(day as any))) {
    return '';
  }
  year = year.toString().substring(4, 2);
  return [month.slice(-2), year].join('');
};

export const formatDateYYYYMMDD = (d) => {
  if (!d) {
    return '';
  }
  d = new Date(d);
  const month = `0${d.getMonth() + 1}`;
  const day = `0${d.getDate()}`;
  let year = d.getFullYear();
  if (year == 20) {
    year = 2020;
  }
  if (!(year && month && day) || (isNaN(year) || isNaN(month as any) || isNaN(day as any))) {
    return '';
  }
  return [year, month.slice(-2), day.slice(-2)].join('');
};

export const addDays = (
  d,
  n,
  format = 'YYYY-MM-DD hh:mm:ss A',
  operator = '+'
) => {
  let date = null;
  if (operator === '-') {
    date = moment(d, format).subtract(n, 'days').format(format);
  } else {
    date = moment(d, format).add(n, 'days').format(format);
  }
  return date;
};

export const formatDateYear = (d) => {
  if (!d) {
    return '';
  }
  d = new Date(d);
  const year = d.getFullYear();
  return year;
};

export const formatDateDay = (d) => {
  if (!d) {
    return '';
  }
  d = new Date(d);
  const day = `0${d.getDate()}`;
  return day.slice(-2);
};

export const formatDateMonth = (d) => {
  if (!d) {
    return '';
  }
  d = new Date(d);
  const month = `0${d.getMonth() + 1}`;
  return month.slice(-2);
};


export const formatDateYY = (d) => {
  if (!d) {
    return '';
  }
  d = new Date(d);
  const month = `0${(d.getMonth() + 1)}`;
  const day = `0${d.getDate()}`;
  let year = d.getFullYear();
  if (year == 20) {
    year = 2020;
  }
  if (!(year && month && day)) {
    return '';
  }
  return [year, month.slice(-2), day.slice(-2)].join('-');
};

export const formatAge = (d) => {
  if (!d) {
    return ''
  }
  const ageDifMs = Date.now() - d.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const getNextXHours = (h) => {
  const date = moment().add(h, 'hours').format('YYYY-MM-DD hh:mm:ss A');
  return date;
};