import { applyMiddleware } from './engine';
import sinon = require('sinon');
import { Provider } from '../interfaces';
import { throwError } from 'rxjs';
import { expect } from 'chai';
import { Payload, Handler, asHandler } from '../providers';

describe('engine', () => {
  let provider: Provider;
  beforeEach(() => {
    provider = {
      sendAsync: () => {}
    } as any;
  });

  it('Applies middleware', () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, { result: args }));

    const updatedResult = { a: 12 };
    const alwaysConstMiddleware = (_: Payload, next: Handler) =>
      next(updatedResult as any);

    const p = applyMiddleware([alwaysConstMiddleware], asHandler(provider));

    p.sendAsync(null, () => {});

    expect(sendAsync.firstCall.args[0]).to.deep.eq(updatedResult);
  });

  it('Propagates errors', done => {
    const errorText = 'Mock Error';
    const alwaysErrorMiddleware = (_: Payload) => throwError(errorText);

    const p = applyMiddleware([alwaysErrorMiddleware], asHandler(provider));

    p.sendAsync(null, err => {
      expect(err).to.eq(errorText);
      done();
    });
  });

  it('should fail build', () => {
    expect(false).to.eq(true);
  });
});
