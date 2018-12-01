import { subscribeLogs } from './logs';
import { rxWebsocketProvider } from 'rpc/providers/websocket';
(global as any).WebSocket = require('ws');

describe('new logs subscription', () => {
  it.only('gets new logs', done => {
    const provider = rxWebsocketProvider({
      url: 'wss://mainnet.infura.io/ws/v3/00b1d4dda44e41e18e064b0f265acded'
    });

    subscribeLogs(provider, {}).subscribe({
      next: console.log,
      error: console.error
    });
  }).timeout(2000000);
});
