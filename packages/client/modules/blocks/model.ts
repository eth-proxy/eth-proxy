import { Observable } from 'rxjs';
import { Block } from '@eth-proxy/rx-web3';

export type BlockLoader = (number: number) => Observable<Block>;
