import {
  PROCESS_CALL,
  ProcessCall,
  createProcessCallSuccess,
  createProcessCallFailed
} from "../actions";
import { ActionsObservable } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { EpicContext } from "../model";
import { of } from "rxjs/observable/of";

import { Observable } from "rxjs/Observable";
import { TxGenerated, ProcessCallFailed, ProcessCallSuccess } from "../actions";

export const processCallEpic = (
  actions$: ActionsObservable<any>,
  _,
  { processCall }: EpicContext
) => {
  return actions$.ofType(PROCESS_CALL).pipe(
    mergeMap(({ payload }: ProcessCall) => {
      return processCall(payload).pipe(
        map(createProcessCallSuccess),
        catchError(err => {
          return of(
            createProcessCallFailed({
              id: payload.id,
              err
            })
          );
        })
      );
    })
  );
};
