import {
  State,
  ObservableStore,
  getDetectedNetwork$,
  createRegisterConract
} from "../store";
import { map } from "rxjs/operators/map";
import { TruffleJson } from "../model";

export interface RegisterContractOptions {
  address?: string;
  genesisBlock?: number;
}

export function registerContract(store: ObservableStore<State>) {
  return (
    json: TruffleJson,
    { address: presetAddress, genesisBlock = 0 }: RegisterContractOptions
  ): void => {
    store
      .let(getDetectedNetwork$)
      .pipe(map(networkId => presetAddress || json.networks[networkId] && json.networks[networkId].address))
      .subscribe(address =>
        store.dispatch(
          createRegisterConract(json, {
            address,
            genesisBlock
          })
        )
      );
  };
}
