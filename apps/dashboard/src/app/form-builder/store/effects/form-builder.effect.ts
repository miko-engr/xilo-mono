import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TreeActions from '../actions/form-builder.action';
import { of, Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { FormViewService } from '@xilo-mono/form-contracts';

@Injectable()
export class FormBuilderEffects {
  constructor(
    private actions$: Actions,
    private formViewService: FormViewService,
  ) {}

    /*
        Form Data
    */
   loadForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TreeActions.getForm),
      switchMap((action: any) => Observable.forkJoin([
        Observable.of(action),
        this.formViewService.getForm(action.id)
      ])),
      switchMap((data: any) => {
        const [action, form] = data;
        console.log('Form from Load: ', form);
        return of({
          type: '[Tree Component] Load Form', nodes: form.components
        });
      }),
      catchError(error => of({
        type: '[Tree Component] error', message: error
      }))
      )
    );
}
