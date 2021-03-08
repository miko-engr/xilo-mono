import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { awsCredential } from '../../constants/appconstant';
AWS.config.update({
  secretAccessKey: awsCredential.secretAccessKey,
  accessKeyId: awsCredential.accessKeyId,
  region: awsCredential.region,
});
const s3 = new AWS.S3();
let fileName = '';
@Injectable()
export class UploadService {
  constructor() {}

  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function (error) {
        if (error) {
          console.log(error);
          return res.status(400).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json({
          title: 'File uploaded successfully',
          obj: { file: fileName },
        });
      });
    } catch (error) {
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'rent-z',
      acl: 'public-read',
      metadata(req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key(req, file, cb) {
        const name = file.originalname
          ? file.originalname.replace('#', '_')
          : 'image';
        fileName = `${Math.floor(Math.random() * 10000)}.${name}`;
        cb(null, fileName);
      },
    }),
  }).array('photos', 3);
}
