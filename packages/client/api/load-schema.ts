import { Observable } from 'rxjs';
import { ObservableStore, State, getLoadedContractFromRef$ } from '../store';
import { ContractInfo } from '../model';
import {
  getContractFromRef,
  createLoadContractSchema
} from '../modules/schema';

export const createSchemaLoader = (store: ObservableStore<State>) => (
  name: string
): Observable<ContractInfo> => {
  const contract = getContractFromRef(name)(store.getState());
  if (!contract) {
    store.dispatch(createLoadContractSchema(name));
  }
  return store.pipe(getLoadedContractFromRef$(name));
};
