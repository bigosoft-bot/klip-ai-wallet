import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Network, Wallet, Token } from '../types';
import { NETWORKS, DEFAULT_NETWORK } from '../constants/networks';
import WalletService from '../services/WalletService';

interface WalletState {
  wallet: Wallet | null;
  currentNetwork: Network;
  balance: string;
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
}

type WalletAction =
  | { type: 'SET_WALLET'; payload: Wallet | null }
  | { type: 'SET_NETWORK'; payload: Network }
  | { type: 'SET_BALANCE'; payload: string }
  | { type: 'SET_TOKENS'; payload: Token[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: WalletState = {
  wallet: null,
  currentNetwork: DEFAULT_NETWORK,
  balance: '0',
  tokens: [],
  isLoading: false,
  error: null,
};

const walletReducer = (state: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case 'SET_WALLET':
      return { ...state, wallet: action.payload };
    case 'SET_NETWORK':
      return { ...state, currentNetwork: action.payload };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_TOKENS':
      return { ...state, tokens: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

interface WalletContextType extends WalletState {
  createWallet: () => Promise<void>;
  importWallet: (privateKeyOrMnemonic: string) => Promise<void>;
  switchNetwork: (networkId: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
  sendTransaction: (to: string, amount: string) => Promise<string>;
  deleteWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  useEffect(() => {
    loadExistingWallet();
  }, []);

  const loadExistingWallet = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const wallet = await WalletService.loadWallet();
      if (wallet) {
        dispatch({ type: 'SET_WALLET', payload: wallet });
        await WalletService.connectWallet(wallet.privateKey, state.currentNetwork);
        await refreshBalance();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load wallet' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createWallet = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const wallet = await WalletService.createWallet();
      dispatch({ type: 'SET_WALLET', payload: wallet });
      await WalletService.connectWallet(wallet.privateKey, state.currentNetwork);
      await refreshBalance();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create wallet' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const importWallet = async (privateKeyOrMnemonic: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const wallet = await WalletService.importWallet(privateKeyOrMnemonic);
      dispatch({ type: 'SET_WALLET', payload: wallet });
      await WalletService.connectWallet(wallet.privateKey, state.currentNetwork);
      await refreshBalance();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to import wallet' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const switchNetwork = async (networkId: string) => {
    try {
      const network = NETWORKS[networkId];
      if (!network) throw new Error('Network not found');
      
      dispatch({ type: 'SET_NETWORK', payload: network });
      WalletService.setNetwork(network);
      
      if (state.wallet) {
        await WalletService.connectWallet(state.wallet.privateKey, network);
        await refreshBalance();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to switch network' });
    }
  };

  const refreshBalance = async () => {
    if (!state.wallet) return;
    
    try {
      const balance = await WalletService.getBalance(state.wallet.address);
      dispatch({ type: 'SET_BALANCE', payload: balance });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch balance' });
    }
  };

  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const txHash = await WalletService.sendTransaction(to, amount);
      await refreshBalance();
      return txHash;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Transaction failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteWallet = async () => {
    try {
      await WalletService.deleteWallet();
      dispatch({ type: 'SET_WALLET', payload: null });
      dispatch({ type: 'SET_BALANCE', payload: '0' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete wallet' });
    }
  };

  const value: WalletContextType = {
    ...state,
    createWallet,
    importWallet,
    switchNetwork,
    refreshBalance,
    sendTransaction,
    deleteWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};