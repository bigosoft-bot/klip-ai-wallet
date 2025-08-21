import { Network } from '../types';

export const NETWORKS: Record<string, Network> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    chainId: 1,
    blockExplorerUrl: 'https://etherscan.io',
    color: '#627EEA',
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    chainId: 56,
    blockExplorerUrl: 'https://bscscan.com',
    color: '#F3BA2F',
  },
  // Testnets for development
  goerli: {
    id: 'goerli',
    name: 'Ethereum Goerli',
    symbol: 'ETH',
    rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY',
    chainId: 5,
    blockExplorerUrl: 'https://goerli.etherscan.io',
    color: '#627EEA',
  },
  bscTestnet: {
    id: 'bscTestnet',
    name: 'BNB Testnet',
    symbol: 'tBNB',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    chainId: 97,
    blockExplorerUrl: 'https://testnet.bscscan.com',
    color: '#F3BA2F',
  },
};

export const DEFAULT_NETWORK = NETWORKS.ethereum;