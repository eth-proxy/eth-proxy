// import { of } from 'rxjs/observable/of';
// import * as Web3 from 'web3';

// import { createProxy } from '../index';
// import { expect } from 'chai';
// import { assoc } from 'ramda';
// import { first } from 'rxjs/operators';

// const myEtherApiUrl = 'https://api.myetherapi.com/eth';
// const infuraUrl = 'https://mainnet.infura.io/metamask';

// const provider = new Web3.providers.HttpProvider(infuraUrl);

// const proxy = createProxy(of(provider), {
//   contractSchemaResolver: ({ name }) =>
//     import(`./schemas/${name}.json`).then(assoc('genesisBlock', 5112140))
// });

// describe('works', () => {

//   it('works', done => {
//     proxy
//       .query({
//         name: 'Test',
//         deps: {
//           EOSToken: {
//             Transfer: {
//               from: '0xcb6abb46dab8f777f435afae2e2a249ae61f2aed'
//             }
//           }
//         }
//       })
//       .pipe(first())
//       .subscribe(result => {
//         expect(result.events.length).to.eq(1);
//         proxy.stop();
//         done();
//       });
//   });

// });

// // curl -X POST   -H "Content-Type: application/json"   --data '{"jsonrpc":"2.0","id":1,"method":"eth_getLogs","params":[{"toBlock":"0x4e024d","fromBlock":"0x4e014c","address":"0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0","topics":[["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],["0x000000000000000000000000cb6abb46dab8f777f435afae2e2a249ae61f2aed"]]}]}'  "https://mainnet.infura.io/"

// // const k = {
// //   "jsonrpc": "2.0",
// //   "id": 1,
// //   "method": "eth_getLogs",
// //   "params": [
// //     {
// //       "toBlock": "0x4e024d",
// //       "fromBlock": "0x4e014c",
// //       "address": "0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0",
// //       "topics": [
// //         ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],
// //         ["0x000000000000000000000000cb6abb46dab8f777f435afae2e2a249ae61f2aed"]
// //       ]
// //     }
// //   ]
// // }
