module.exports = {
  name: 'customer-form',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/customer-form',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
