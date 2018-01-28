import { Observable } from 'rxjs/Observable';

export interface EthCallInterceptor {
  ethCall: (obs: Observable<any>) => Observable<any>;
}

export interface TransactionInterceptor {
  transaction: (obs: Observable<any>) => Observable<any>;
}

export interface PreQueryInterceptor {
  preQuery: (obs: Observable<any>) => Observable<any>;
}

export interface PostQueryInterceptor {
  postQuery: (obs: Observable<any>) => Observable<any>;
}

export type EthProxyInterceptors = EthCallInterceptor &
  TransactionInterceptor &
  PreQueryInterceptor &
  PostQueryInterceptor;
