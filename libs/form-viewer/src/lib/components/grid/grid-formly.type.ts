export const gridType = (
  key: string,
  columnDefs: any[],
  fieldGroup: any[],
  model: any[]
) => {
  return {
    key: key,
    type: 'grid',
    className: 'ag-theme-balham',
    templateOptions: {
      isGrid: true,
      height: '200px',
      gridOptions: {
        rowHeight: 50,
        columnDefs: columnDefs,
      },
      model: model,
    },
    fieldArray: {
      fieldGroup: fieldGroup,
    },
  };
};
