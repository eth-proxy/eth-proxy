import { Observable } from 'rxjs';
import { Block } from '@eth-proxy/rpc';

export type BlockLoader = (number: number) => Observable<Block>;
