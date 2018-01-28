import { Observable } from 'rxjs/Observable';

import {
  ObservableStore,
  State,
  createLoadContractSchema,
  getLoadedContractFromRef$,
  ContractInfo,
  getContractFromRef
} from '../../store';

export const createSchemaLoader = (store: ObservableStore<State>) => (
  name: string
) => {
  const contract = getContractFromRef(name)(store.getState());
  if (!contract) {
    store.dispatch(createLoadContractSchema(name));
  }
  return store.let(getLoadedContractFromRef$(name));
};
