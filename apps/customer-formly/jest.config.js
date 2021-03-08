module.exports = {
  name: 'customer-formly',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/customer-formly',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
