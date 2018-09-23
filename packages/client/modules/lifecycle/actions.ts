export const ETH_PROXY_STARTED = 'ETH_PROXY_STARTED';

export interface EthProxyStarted {
  type: typeof ETH_PROXY_STARTED;
}

export const createEthProxyStarted = (): EthProxyStarted => ({
  type: ETH_PROXY_STARTED
});

export const ETH_PROXY_STOPPED = 'ETH_PROXY_STOPPED';

export interface EthProxyStopped {
  type: typeof ETH_PROXY_STOPPED;
}

export const createEthProxyStopped = (): EthProxyStopped => ({
  type: ETH_PROXY_STOPPED
});
