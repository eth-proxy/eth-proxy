export const SET_NETWORK = "SET_NEWORK";

export interface SetNetwork {
  type: "SET_NEWORK";
  payload;
}

export const createSetNetwork = (networkId: string) => ({
  type: SET_NETWORK,
  payload: networkId
});

export type NetworkTypes = SetNetwork;