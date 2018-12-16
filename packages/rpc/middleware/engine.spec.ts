import { applyMiddleware } from './engine';
import { throwError } from 'rxjs';
import { expect } from 'chai';
import { testProvider } from '../mocks';
import { RpcRequest } from 'rpc/interfaces';
import { RpcRequestHandler } from './model';

describe('engine', () => {
  it('Applies middleware', () => {
    const provider = testProvider();

    const updatedResult = { a: 12 };
    const alwaysConstMiddleware = (_: RpcRequest, next: RpcRequestHandler) =>
      next(updatedResult as any);

    const p = applyMiddleware([alwaysConstMiddleware], provider);

    p.send(null);

    expect(provider.getOnlyRequest()).to.deep.eq(updatedResult);
  });

  it('Propagates errors', done => {
    const provider = testProvider();

    const errorText = 'Mock Error';
    const alwaysErrorMiddleware = (_: RpcRequest) => throwError(errorText);

    const p = applyMiddleware([alwaysErrorMiddleware], provider);

    p.send(null).catch(err => {
      expect(err).to.eq(errorText);
      done();
    });
  });
});
