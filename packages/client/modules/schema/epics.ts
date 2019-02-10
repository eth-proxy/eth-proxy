import { ActionsObservable, StateObservable } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { defer, of } from 'rxjs';

import * as actions from './actions';
import { EpicContext } from 'client/context';
import { State } from 'client/store';
import { ofType } from 'client/utils';

export const loadContractSchema = (
  actions$: ActionsObservable<actions.LoadContractSchema>,
  _: StateObservable<State>,
  { options }: EpicContext
) => {
  return actions$.pipe(
    ofType(actions.LOAD_CONTRACT_SCHEMA),
    mergeMap(({ payload: { name } }) => {
      return defer(() => options.contractSchemaResolver({ name })).pipe(
        map(schema => ({ genesisBlock: 0, ...schema })),
        map(actions.createLoadContractSchemaSuccess),
        catchError(err => of(actions.createLoadContractSchemaFailed(name, err)))
      );
    })
  );
};
