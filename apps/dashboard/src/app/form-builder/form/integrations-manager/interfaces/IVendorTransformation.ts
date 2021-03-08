export interface IVendorTransformation {
  method?: string;
  formFieldKey?: string;
  formFieldLabel?: string;
  vendorFieldType?: string;
  operator?: string;
  newValue?: string;
  addedValue?: string;
  conditionalFormFieldKey?: string;
  conditionalValueMethod?: string;
  conditionalOperator?: string;
  conditionalValue?: string;
  stringTransformType?: string;
}
