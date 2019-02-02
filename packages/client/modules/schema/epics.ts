import { ActionsObservable, StateObservable } from 'redux-observable';
import { mergeMap, map, catchError, first } from 'rxjs/operators';
import { defer, of, combineLatest } from 'rxjs';
import { pathOr } from 'ramda';

import { ResolvedContractSchema, ContractSchema } from './model';
import * as actions from './actions';
import * as fromNetwork from '../network';
import { EpicContext } from '../../context';
import { State } from '../../store';
import { ofType } from '../../utils';

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
) => {
  return actions$.pipe(
    ofType(actions.LOAD_CONTRACT_SCHEMA),
    mergeMap(({ payload: { name } }) => {
      return combineLatest(
        defer(() => options.contractSchemaResolver({ name })),
        state$.pipe(
          map(fromNetwork.getNetworkId),
          first(x => !!x)
        ),
        mapResolvedContractSchema
      ).pipe(
        map(([schema]) => actions.createLoadContractSchemaSuccess(schema)),
        catchError(err => of(actions.createLoadContractSchemaFailed(name, err)))
      );
    })
  );
};
