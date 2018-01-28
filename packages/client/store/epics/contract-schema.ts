import { ActionsObservable, ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import {
  EpicContext,
  ContractSchemaExtras,
  ResolvedContractSchema,
  ContractSchema
} from '../model';
import {
  createLoadContractSchemaSuccess,
  createLoadContractSchemaFailed,
  LoadContractSchemaSuccess,
  LoadContractSchema,
  LOAD_CONTRACT_SCHEMA,
  LOAD_CONTRACT_SCHEMA_SUCCESS,
  LoadContractSchemaFailed
} from '../actions';
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
  actions$: ActionsObservable<any>,
  _,
  { contractSchemaResolver, state$ }: EpicContext
) => {
  return actions$.pipe(
    ofType<LoadContractSchema>(LOAD_CONTRACT_SCHEMA),
    mergeMap(({ payload: { name } }) => {
      return combineLatest(
        defer(() => contractSchemaResolver({ name })),
        state$.let(getDetectedNetwork$),
        mapResolvedContractSchema
      ).pipe(
        map(createLoadContractSchemaSuccess),
        catchError(err => of(createLoadContractSchemaFailed(name, err)))
      );
    })
  );
};
