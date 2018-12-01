import { Observable } from 'rxjs';

export interface PubSubProvider {
  unsubscribe(): void;
  next(value: any): void;
  error(err: any): void;
  complete(): void;
  observe: Observable<any>;
}
