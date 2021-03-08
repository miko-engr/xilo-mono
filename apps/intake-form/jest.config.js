module.exports = {
  name: 'intake-form',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/intake-form',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
