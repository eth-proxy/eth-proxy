// import { Observable } from "rxjs/Observable";
// import { EthProxy } from "./model";

// interface Contracts {
//   Contract1: {
//     balanceOf: ({} : { a : 12}) => Observable<any>
//   };
// }

// const proxy: EthProxy<Contracts> = undefined;

// // Valid
// proxy.transaction({
//   interface: 'Contract1',
//   method: 'balanceOf'
// })({ a : 12});

// // Not Valid
// proxy.transaction({
//   interface: 'Contract1',
//   method: 'balanceOf'
// })({ a : 12 });
