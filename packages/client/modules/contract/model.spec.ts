import { RequestHandlers, Request } from './model';

interface Contract {
  method1: {
    in: string;
    out: number;
    events: undefined;
  };
  method2: {
    in: string;
    out: number;
    events: undefined;
  };
}

interface Contract2 {
  method12: {
    in: string;
    out: number;
    events: undefined;
  };
  method21: {
    in: string;
    out: number;
    events: undefined;
  };
}

interface Contracts {
  Contract1: Contract;
  Contract2: Contract2;
}

const handlers: RequestHandlers<Contracts> = undefined;
const request: Request<'Contract1', 'method1', string> = undefined;
const request2: Request<string, string, string> = undefined;

// handlers.ethCall({
//   interface: 'Contract1',
//   method: 'method1',
//   payload: '12'
// })

// handlers.ethCall(request)
