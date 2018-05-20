import { Observable } from 'rxjs/Observable';

import {
  ObservableStore,
  State,
  getLoadedContractFromRef$,
  getContractFromRef
} from '../../store';
import * as actions from './actions';
import { ContractInfo } from '../schema';

export const createSchemaLoader = (store: ObservableStore<State>) => (
  name: string
): Observable<ContractInfo> => {
  const contract = getContractFromRef(name)(store.getState());
  if (!contract) {
    store.dispatch(actions.createLoadContractSchema(name));
  }
  return store.pipe(getLoadedContractFromRef$(name));
};
