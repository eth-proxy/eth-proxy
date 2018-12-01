import { subscribeNewHeads } from './new-heads';
import { rxWebsocketProvider } from 'rpc/providers/websocket';
import { take } from 'rxjs/operators';
(global as any).WebSocket = require('ws');

describe('new heads subscription', () => {
  it('gets new heads', done => {
    const provider = rxWebsocketProvider({
      url: 'wss://mainnet.infura.io/ws/v3/00b1d4dda44e41e18e064b0f265acded'
    });

    subscribeNewHeads(provider, {})
      .pipe(take(10))
      .subscribe({
        next: console.log,
        error: console.error
      });
  }).timeout(2000000);
});
