import { environment } from '../environments/environment';

export const BASE_URL = environment.apiUrl;

export const V1_FORM_URL = window.location.hostname.includes('xilo-dev')
  ? 'https://xilo-develop.herokuapp.com/client-app/'
  : window.location.hostname.includes('xilo-staging')
  ? 'https://xilo-staging.herokuapp.com/client-app/'
  : window.location.hostname.includes('localhost')
  ? 'http://localhost:4200/client-app/'
  : 'https://app.xilo.io/client-app/';

export const QUESTION_URL = `${BASE_URL}question`;
export const NEW_CLIENT_URL = `${BASE_URL}new/client`;
export const VEHICLE_API_URL = `${BASE_URL}vehicleApi`;
export const VEHICLE_LIST_URL = `${BASE_URL}vehicle-list`;
