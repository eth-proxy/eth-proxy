import { Observable } from "rxjs/Observable";
import { map, filter } from "rxjs/operators";

import { Transaction } from "../../../model";

type PendingStatus = "init" | "tx";
const pendingStatuses = ["init", "tx"];

export function once(obs: Observable<Transaction>) {
  return (type: PendingStatus, fn) =>
    obs.let(
      map(next => {
        if (!next || type !== next.status) {
          return next;
        }

        switch (next.status) {
          case "init":
            return fn(next);
          case "tx":
            return fn(next.tx);
          default:
            next;
        }
      })
    );
}

export function on(obs: Observable<Transaction>) {
  return (type: "confirmed", fn) =>
    obs.pipe(
      filter(next => {
        return !(next && pendingStatuses.includes(next.status));
      }),
      map(next => {
        return next.status === type ? fn(next) : next;
      })
    );
}
