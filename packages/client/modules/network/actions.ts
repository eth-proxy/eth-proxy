export const SET_NETWORK = 'SET_NEWORK';

export interface SetNetwork {
  type: 'SET_NEWORK';
  payload: string;
}

export const createSetNetwork = (networkId: string): SetNetwork => ({
  type: SET_NETWORK,
  payload: networkId
});

export type Types = SetNetwork;
