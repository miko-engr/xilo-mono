module.exports = {
  name: 'pdf-mapper',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/pdf-mapper',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
