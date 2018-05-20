import { curry, CurriedFunction2 } from 'ramda';

export interface CallPayload {
  contractName: string;
  address?: string;
  method: string;
  txParams: any;
  args: any;
}

export const PROCESS_CALL = 'PROCESS_CALL';

export interface ProcessCall {
  type: 'PROCESS_CALL';
  payload: CallPayload & {
    id: string;
  };
}

export const createProcessCall = (
  payload: ProcessCall['payload']
): ProcessCall => ({
  type: PROCESS_CALL,
  payload
});

export const PROCESS_CALL_SUCCESS = 'PROCESS_CALL_SUCCESS';

export interface ProcessCallSuccess {
  type: 'PROCESS_CALL_SUCCESS';
  payload: {
    data: any;
    id: string;
  };
}

export const createProcessCallSuccess = curry(
  (id: string, data: any): ProcessCallSuccess => ({
    type: PROCESS_CALL_SUCCESS,
    payload: {
      id,
      data
    }
  })
);

export const PROCESS_CALL_FAILED = 'PROCESS_CALL_FAILED';

export interface ProcessCallFailed {
  type: 'PROCESS_CALL_FAILED';
  payload: {
    id: string;
    err: any;
  };
}

export const createProcessCallFailed = (
  payload: ProcessCallFailed['payload']
): ProcessCallFailed => ({
  type: PROCESS_CALL_FAILED,
  payload
});

export type Types = ProcessCall | ProcessCallSuccess | ProcessCallFailed;
