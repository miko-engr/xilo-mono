module.exports = {
  name: 'dashboard',
  preset: '../../jest.config.js',
  collectCoverage: true,
  coverageDirectory: '../../coverage/apps/dashboard',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  transformIgnorePatterns: [`/node_modules/(?!lodash-es)`]
};
