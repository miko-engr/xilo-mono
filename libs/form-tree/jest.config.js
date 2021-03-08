module.exports = {
  name: 'form-tree',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/form-tree',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
