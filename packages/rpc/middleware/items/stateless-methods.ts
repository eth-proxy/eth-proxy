import { MiddlewareItem } from '../model';
import { of } from 'rxjs';
import { Dictionary } from 'ramda';
import { createIdGenerator } from '../../utils';

export const statelessMethodsMiddleware = (
  genId = createIdGenerator()
): MiddlewareItem => {
  const filters: Dictionary<any> = {};
  return (payload, next) => {
    switch (payload.method) {
      case 'eth_newBlockFilter':
      case 'eth_newFilter': {
        const id = genId();
        filters[id] = payload.params;

        return of({ result: id });
      }

      case 'eth_getFilterChanges':
        return of({ result: [] });

      case 'eth_uninstallFilter': {
        const filterId = payload.params[0];
        delete filters[filterId];

        return of({ result: true });
      }

      case 'eth_getFilterLogs': {
        const filterId = payload.params[0];

        return next({
          ...payload,
          method: 'eth_getLogs',
          params: filters[filterId]
        });
      }

      default:
        return next(payload);
    }
  };
};
