import { ActionsObservable, ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { EpicContext, ResolvedContractSchema, ContractSchema } from '../model';
import * as actions from '../actions';
import { getDetectedNetwork$ } from '../rx-selectors';

import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { pathOr } from 'ramda';

export const mapResolvedContractSchema = (
  schema: ResolvedContractSchema,
  networkId: string
): ContractSchema =>
  Object.assign(
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

export const loadContractSchema = (
  actions$: ActionsObservable<actions.LoadContractSchema>,
  _,
  { contractSchemaResolver, state$ }: EpicContext
) => {
  return actions$.pipe(
    ofType(actions.LOAD_CONTRACT_SCHEMA),
    mergeMap(({ payload: { name } }) => {
      return combineLatest(
        defer(() => contractSchemaResolver({ name })),
        state$.pipe(getDetectedNetwork$),
        mapResolvedContractSchema
      ).pipe(
        map(actions.createLoadContractSchemaSuccess),
        catchError(err => of(actions.createLoadContractSchemaFailed(name, err)))
      );
    })
  );
};
