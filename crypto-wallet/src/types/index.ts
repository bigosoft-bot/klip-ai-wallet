export interface Network {
  id: string;
  name: string;
  symbol: string;
  rpcUrl: string;
  chainId: number;
  blockExplorerUrl: string;
  color: string;
}

export interface Wallet {
  address: string;
  privateKey: string;
  mnemonic?: string;
}

export interface Token {
  symbol: string;
  name: string;
  address?: string;
  decimals: number;
  balance: string;
  usdValue?: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  network: string;
}