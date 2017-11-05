import { ReaderResult } from "./model";
import { map as rxMap, bufferWhen } from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import { flatten, prop } from "ramda";
import { Subject } from "rxjs/Subject";

export function bufferResult({
  work$,
  result$
}: ReaderResult): Observable<any[]> {
  const complete$ = new Subject();

  work$.subscribe(
    _ => {
      complete$.error("Could not fulfill request, ranges not found");
    },
    _ => complete$.error("Could not fulfill request"),
    () => {
      complete$.complete();
    }
  );

  return result$.pipe(
    rxMap(prop("result")),
    bufferWhen(() => complete$),
    rxMap(flatten)
  );
}
