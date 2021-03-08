export const datatableType = (
  key: string,
  columns: any[],
  fieldGroup: any[],
  model: any[]
) => {
  return {
    key: key,
    type: 'datatable',
    templateOptions: {
      isDatatable: true,
      columns: columns,
      model: model,
    },
    fieldArray: {
      fieldGroup: fieldGroup,
    },
  };
};
