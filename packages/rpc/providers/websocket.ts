import { webSocket, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { PubSubProvider } from '../interfaces';

export function rxWebsocketProvider(
  config: string | WebSocketSubjectConfig<any>
): PubSubProvider {
  const ws = webSocket(config);

  return {
    complete: ws.complete.bind(ws),
    error: ws.error.bind(ws),
    next: ws.next.bind(ws),
    observe: ws.asObservable(),
    unsubscribe: ws.unsubscribe.bind(ws)
  };
}
