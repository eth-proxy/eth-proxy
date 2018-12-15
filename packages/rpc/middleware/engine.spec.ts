import { applyMiddleware } from './engine';
import { throwError } from 'rxjs';
import { expect } from 'chai';
import { Payload, Handler, asHandler } from '../providers';
import { testProvider } from '../mocks';

describe('engine', () => {
  it('Applies middleware', () => {
    const provider = testProvider();

    const updatedResult = { a: 12 };
    const alwaysConstMiddleware = (_: Payload, next: Handler) =>
      next(updatedResult as any);

    const p = applyMiddleware([alwaysConstMiddleware], provider);

    p.send(null);

    expect(provider.getOnlyRequest()).to.deep.eq(updatedResult);
  });

  it('Propagates errors', done => {
    const provider = testProvider();

    const errorText = 'Mock Error';
    const alwaysErrorMiddleware = (_: Payload) => throwError(errorText);

    const p = applyMiddleware([alwaysErrorMiddleware], provider);

    p.send(null).catch(err => {
      expect(err).to.eq(errorText);
      done();
    });
  });
});
