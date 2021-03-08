import { IVendorTransformation } from "./IVendorTransformation";

export interface IVendorMapping {
  vendorPath: string;
  vendorFieldType: string;
  staticValue: any;
  staticArrayIndex: number;
  formFieldKey: string;
  formFieldLabel: string;
  transformation?: IVendorTransformation;
}
