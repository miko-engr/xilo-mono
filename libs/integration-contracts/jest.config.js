module.exports = {
  name: 'integration-contracts',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/integration-contracts',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
