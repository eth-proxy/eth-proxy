import { Block } from '@eth-proxy/rpc';
import { curry } from 'ramda';

export const LOAD_BLOCK = 'LOAD_BLOCK';

export interface LoadBlock {
  type: typeof LOAD_BLOCK;
  payload: number;
}

export const createLoadBlock = (number: number): LoadBlock => ({
  type: LOAD_BLOCK,
  payload: number
});

export const LOAD_BLOCK_SUCCESS = 'LOAD_BLOCK_SUCCESS';

export interface LoadBlockSuccess {
  type: typeof LOAD_BLOCK_SUCCESS;
  payload: Block;
}

export const createLoadBlockSuccess = (payload: Block): LoadBlockSuccess => ({
  type: LOAD_BLOCK_SUCCESS,
  payload
});

export const LOAD_BLOCK_FAILED = 'LOAD_BLOCK_FAILED';

export interface LoadBlockFailed {
  type: typeof LOAD_BLOCK_FAILED;
  payload: {
    number: number;
    err: any;
  };
}

export const createLoadBlockFailed = curry(
  (number: number, err: any): LoadBlockFailed => ({
    type: LOAD_BLOCK_FAILED,
    payload: {
      number,
      err
    }
  })
);

export const UPDATE_LATEST_BLOCK_FAILED = 'UPDATE_LATEST_BLOCK_FAILED';

export interface UpdateLatestBlockFailed {
  type: typeof UPDATE_LATEST_BLOCK_FAILED;
  payload: Error;
}

export const createUpdateLatestBlockFailed = (
  payload: Error
): UpdateLatestBlockFailed => ({
  type: UPDATE_LATEST_BLOCK_FAILED,
  payload
});

export type Types =
  | LoadBlock
  | LoadBlockSuccess
  | LoadBlockFailed
  | UpdateLatestBlockFailed;
