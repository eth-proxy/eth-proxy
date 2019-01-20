import { Provider, arrify } from '@eth-proxy/rpc';
import { zip } from 'ramda';
import { Action } from 'redux';
import { toRequest, toResponseFailed, toResponseSuccess } from './actions';

export function connectProvider(
  dispatch: (action: Action) => void,
  provider: Provider
): Provider {
  return {
    ...provider,
    send: payload => {
      const payloads = arrify(payload);
      const requestActions = payloads.map(toRequest);

      // use redux batch
      requestActions.forEach(action => dispatch(action));

      return provider.send(payload).then(responses => {
        zip(payloads, arrify(responses)).forEach(([request, response]) => {
          const creator = response.error ? toResponseFailed : toResponseSuccess;
          const action = creator(request, response);
          dispatch(action);
        });

        return responses;
      });
    }
  };
}
