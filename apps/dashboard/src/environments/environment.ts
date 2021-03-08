// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: window.location.hostname.includes('xilo-dev')
    ? 'development'
    : window.location.hostname.includes('xilo-staging')
    ? 'staging'
    : 'local',
  apiUrl: window.location.hostname.includes('xilo-dev')
    ? 'https://xilo-dev-api.herokuapp.com/api/'
    : window.location.hostname.includes('xilo-staging')
    ? 'https://xilo-staging-api.herokuapp.com/api/'
    : 'http://localhost:3000/api/',
  devApiUrl: 'https://xilo-dev-api.herokuapp.com/api/',
  customerFormUrl: window.location.hostname.includes('localhost')
    ? 'http://localhost:4200'
    : 'https://xilo-dev-customer-form.herokuapp.com',
  intakeFormUrl: window.location.hostname.includes('localhost')
    ? 'http://localhost:4300'
    : 'https://xilo-dev-intake-form.herokuapp.com',
  stagingApiUrl: 'https://xilo-staging-api.herokuapp.com/api/',
  stripePKey: 'pk_test_8BZV1HDVmH7VBumHF1NwswJv',
  GOOGLE_MAPS_API_KEY: 'AIzaSyBQAjsTHZqpNd-0km49l0xV0KvVOsZNkZQ',
  VAPIDPUBLICKEY:
    'BKMmPypsmpRWfpNEqlHYOUU0XzNwJ5AwExSY5fF_xjCDTEQ8-3rJGHkDtGpWAg-ZxwF1YAjRUyFDJ6NPkUKvOyY',
  S3_BUCKET_URL: 'https://s3-us-west-2.amazonaws.com/rent-z/',
  XILO_REP: [
    { name: 'Jon Corrin', title: 'CEO', email: 'jon@xilo.io' },
    { name: 'Eli Zaragoza', title: 'President', email: 'eli@xilo.io' },
  ],
  SOCKET_ENDPOINT: window.location.hostname.includes('xilo-dev')
    ? 'https://xilo-dev-api.herokuapp.com'
    : window.location.hostname.includes('xilo-staging')
    ? 'https://xilo-staging-api.herokuapp.com'
    : 'http://localhost:3000',
};
