interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

interface ProviderMessage {
  readonly type: string;
  readonly data: unknown;
}

interface EthSubscription extends ProviderMessage {
  readonly type: 'eth_subscription';
  readonly data: {
    readonly subscription: string;
    readonly result: unknown;
  };
}

interface ProviderConnectInfo {
  readonly chainId: string;
}

interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export type ProviderAccounts = string[];

export interface SimpleEventEmitter {
  // add listener
  on(event: string, listener: any): void;
  // add one-time listener
  once(event: string, listener: any): void;
  // remove listener
  removeListener(event: string, listener: any): void;
  // removeListener alias
  off(event: string, listener: any): void;
}

export interface EIP1193Provider extends SimpleEventEmitter {
  // connection event
  on(event: 'connect', listener: (info: ProviderInfo) => void): void;
  // disconnection event
  on(event: 'disconnect', listener: (error: ProviderRpcError) => void): void;
  // arbitrary messages
  on(event: 'message', listener: (message: ProviderMessage) => void): void;
  // chain changed event
  on(event: 'chainChanged', listener: (chainId: ProviderChainId) => void): void;
  // accounts changed event
  on(event: 'accountsChanged', listener: (accounts: ProviderAccounts) => void): void;
  // make an Ethereum RPC method call.
  request(args: RequestArguments): Promise<unknown>;
}
