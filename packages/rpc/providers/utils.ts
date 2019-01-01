import { RpcResponse, RpcRequest } from '../interfaces';
import { arrify } from '../utils';

export const isMatchingResponse = <Req extends RpcRequest | RpcRequest[]>(
  req: Req,
  res: RpcResponse | RpcResponse[]
) => {
  if (Array.isArray(req)) {
    return (
      Array.isArray(res) &&
      res.length === req.length &&
      res.some(r => req.some(p => p.id === r.id))
    );
  } else {
    return (res as RpcResponse).id === (req as RpcRequest).id;
  }
};

// Should aggregate errors
export function validateResponse(res: RpcResponse | RpcResponse[]) {
  arrify(res).forEach(validateRpcResponse);
}

function validateRpcResponse(response: RpcResponse) {
  if ('error' in response) {
    throw Error(JSON.stringify(response.error));
  }
}
