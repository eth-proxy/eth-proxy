// import { timer, of } from 'rxjs';
// import {
//   mergeMap,
//   first,
//   distinctUntilKeyChanged,
//   takeUntil,
//   bufferCount,
//   tap
// } from 'rxjs/operators';
// import { snapshot, revert, mine } from './utils';
// import {
//   httpProvider,
//   watchBlocks,
//   watchLogs
// } from '@eth-proxy/rx-web3';
// import { sendTransactionWithData } from '@eth-proxy/rx-web3/methods/request/send-transaction';
// import { isEmpty } from 'ramda';

// describe('ERC20', () => {
//   beforeEach(() => snapshot());
//   afterEach(() => revert());

//   it('Watches latest block', done => {
//     const watch$ = watchBlocks(httpProvider(), {
//       timer$: timer(0, 50)
//     }).pipe(
//       distinctUntilKeyChanged('number'),
//       bufferCount(5),
//       first()
//     );
//     const miner$ = timer(0, 100).pipe(
//       mergeMap(mine),
//       takeUntil(watch$)
//     );

//     watch$.subscribe(() => {
//       done();
//     });
//     miner$.subscribe();
//   });

//   it('Watches events', done => {
//     const latestBlock$ = watchBlocks(httpProvider(), {
//       timer$: timer(0, 50)
//     }).pipe(
//       tap((hash) => {
//         console.log('mined', hash);
//       })
//     );

//     const watch$ = watchLogs(httpProvider(), {
//       filter: {
//         fromBlock: 0
//       }
//     }).pipe(first(x => x.length > 0));

//     const transfer$ = of(1, 2, 3).pipe(
//       mergeMap(() =>
//         sendTransactionWithData(httpProvider(), {
//           from: '0xad46016a23f922fa57438b51ef0636f86868e2cb',
//           to: '0xad46016a23f922fa57438b51ef0636f86868e2cb',
//           value: '100',
//           data: '0',
//           gas: '21000'
//         })
//       )
//     );

//     watch$.subscribe(logs => {
//       console.log(logs);
//       done();
//     });
//     transfer$.subscribe();
//   });
// });
