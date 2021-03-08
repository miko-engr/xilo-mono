// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://localhost:3000/api/',
  // devApiUrl: 'http://localhost:3000/api/',
  apiUrl: 'https://xilo-staging-api.herokuapp.com/api/',
  devApiUrl: 'https://xilo-staging-api.herokuapp.com/api/',
  stagingApiUrl: 'https://xilo-staging-api.herokuapp.com/api/',
  localApiUrl: 'http://localhost:3000/api/',
  stripePKey: 'pk_test_8BZV1HDVmH7VBumHF1NwswJv',
  estatedAPIKey: 'IJL7wFr1XJN7rWJru2i7zNghi1fep1',
  GOOGLE_MAPS_API_KEY: 'AIzaSyBQAjsTHZqpNd-0km49l0xV0KvVOsZNkZQ'
};
