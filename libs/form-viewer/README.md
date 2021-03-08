# form-viewer

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test form-viewer` to execute the unit tests.


## Intake form requirements

Need to use `section-wrapper` in all intake-sections
Need to use `intake-section` in all intake-sections
Need to add `className` to templateOptions for appropriate input styling
Need to not add any `questionGroup` types
Need to add `intake-repeat` instead of repeat for repeating sections on intake
Need to add `isTable: true` to table sections `templateOptions`
Use FormViewSerivce.formState Observable to bind to formState.valid
User FormViewService.submitForm Obserable to bind to onSubmit event

