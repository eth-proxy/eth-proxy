import { ReaderResult } from "./model";
import { map as rxMap, bufferWhen } from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import { flatten } from "ramda";
import { Subject } from "rxjs/Subject";

export function bufferResult({
  work$,
  result$
}: ReaderResult): Observable<any[]> {
  const complete$ = new Subject();

  work$.subscribe({
    next: _ => complete$.error("Could not fulfill request, ranges not found"),
    error: _ => complete$.error("Could not fulfill request"),
    complete: () => complete$.complete()
  });

  return result$.pipe(
    rxMap((x: any) => x.result),
    bufferWhen(() => complete$),
    rxMap(flatten)
  );
}
