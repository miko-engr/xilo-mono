export const environment = {
  production: true,
  env: 'production',
  apiUrl: window.location.hostname.includes('xilo-dev')
    ? 'https://xilo-dev-api.herokuapp.com/api/'
    : window.location.hostname.includes('xilo-staging')
    ? 'https://xilo-staging-api.herokuapp.com/api/'
    : 'https://api.xilo.io/api/',
  devApiUrl: 'https://xilo-dev-api.herokuapp.com/api/',
  stagingApiUrl: 'https://xilo-staging-api.herokuapp.com/api/',
  customerFormUrl: 'https://xilo-customer-form.herokuapp.com',
  intakeFormUrl: 'https://xilo-intake-form.herokuapp.com',
  stripeTestPKey: 'pk_test_8BZV1HDVmH7VBumHF1NwswJv',
  stripePKey: 'pk_live_3LxpaM8RR67YSc9xx0Eys34y',
  GOOGLE_MAPS_API_KEY: 'AIzaSyBQAjsTHZqpNd-0km49l0xV0KvVOsZNkZQ',
  VAPIDPUBLICKEY:
    'BKMmPypsmpRWfpNEqlHYOUU0XzNwJ5AwExSY5fF_xjCDTEQ8-3rJGHkDtGpWAg-ZxwF1YAjRUyFDJ6NPkUKvOyY',
  S3_BUCKET_URL: 'https://s3-us-west-2.amazonaws.com/rent-z/',
  XILO_REP: [
    { name: 'Jon Corrin', title: 'CEO', email: 'jon@xilo.io' },
    { name: 'Eli Zaragoza', title: 'President', email: 'eli@xilo.io' },
  ],
  SOCKET_ENDPOINT: 'https://api.xilo.io',
};
