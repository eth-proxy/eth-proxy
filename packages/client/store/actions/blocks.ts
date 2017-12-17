import { Block } from 'web3';
import { pipe, reject, isNil, uniq } from 'ramda';

export const UPDATE_LATEST_BLOCK = 'UPDATE_LATEST_BLOCK';

export interface UpdateLatestBlock {
  type: 'UPDATE_LATEST_BLOCK';
  payload: Block;
}

export const createUpdateLatestBlock = (payload: Block): UpdateLatestBlock => ({
  type: UPDATE_LATEST_BLOCK,
  payload
});

export type Types = UpdateLatestBlock;
