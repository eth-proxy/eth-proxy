import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, defer, of, combineLatest } from 'rxjs';
import { pathOr } from 'ramda';

import { ResolvedContractSchema, ContractSchema } from './model';
import * as actions from './actions';
import { getDetectedNetwork$ } from '../../store/rx-selectors';
import { EpicContext } from '../../context';
import { State } from '../../store';

export const mapResolvedContractSchema = (
  schema: ResolvedContractSchema,
  networkId: string
): ContractSchema => {
  return Object.assign(
    {
      address: pathOr<string | undefined>(
        undefined,
        ['networks', networkId, 'address'],
        schema
      ),
      genesisBlock: 0
    },
    schema
  );
};

export const loadContractSchema = (
  actions$: ActionsObservable<actions.LoadContractSchema>,
  state$: StateObservable<State>,
  { options }: EpicContext
): Observable<actions.Types> => {
  return actions$.pipe(
    ofType(actions.LOAD_CONTRACT_SCHEMA),
    mergeMap(({ payload: { name } }) => {
      return combineLatest(
        defer(() => options.contractSchemaResolver({ name })),
        state$.pipe(getDetectedNetwork$),
        mapResolvedContractSchema
      ).pipe(
        map(actions.createLoadContractSchemaSuccess),
        catchError(err => of(actions.createLoadContractSchemaFailed(name, err)))
      );
    })
  );
};
