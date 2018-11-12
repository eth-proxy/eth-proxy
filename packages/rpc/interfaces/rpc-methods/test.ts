import { Rpc, BaseRpcRequest } from '../rpc';
import { Data } from '../primitives';

/**
 * https://github.com/trufflesuite/ganache-cli#implemented-methods
 */
export interface TestSnapshotRequest extends BaseRpcRequest {
  method: 'evm_snapshot';
  params: [];
}
export type TestSnapshot = Rpc<TestSnapshotRequest, number>;

/**
 * https://github.com/trufflesuite/ganache-cli#implemented-methods
 */
export interface TestRevertRequest extends BaseRpcRequest {
  method: 'evm_revert';
  params: [Data] | [];
}
export type TestRevert = Rpc<TestRevertRequest, true>;

/**
 * https://github.com/trufflesuite/ganache-cli#implemented-methods
 */
export interface TestIncreaseTimeRequest extends BaseRpcRequest {
  method: 'evm_increaseTime';
  params: [number];
}
export type TestIncreaseTime = Rpc<TestIncreaseTimeRequest, number>;

/**
 * https://github.com/trufflesuite/ganache-cli#implemented-methods
 */
export interface TestMineRequest extends BaseRpcRequest {
  method: 'evm_mine';
  params: [number];
}
export type TestMine = Rpc<TestIncreaseTimeRequest, any>;

export type TestMethod =
  | TestSnapshot
  | TestRevert
  | TestIncreaseTime
  | TestMine;
