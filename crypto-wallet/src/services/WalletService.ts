import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Network, Wallet, Token } from '../types';

class WalletService {
  private provider: ethers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;

  async createWallet(): Promise<Wallet> {
    const wallet = ethers.Wallet.createRandom();
    const walletData: Wallet = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase,
    };
    
    await this.saveWallet(walletData);
    return walletData;
  }

  async importWallet(privateKeyOrMnemonic: string): Promise<Wallet> {
    let wallet: ethers.Wallet;
    
    if (privateKeyOrMnemonic.includes(' ')) {
      // It's a mnemonic
      wallet = ethers.Wallet.fromPhrase(privateKeyOrMnemonic);
    } else {
      // It's a private key
      wallet = new ethers.Wallet(privateKeyOrMnemonic);
    }

    const walletData: Wallet = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase,
    };
    
    await this.saveWallet(walletData);
    return walletData;
  }

  async saveWallet(wallet: Wallet): Promise<void> {
    await AsyncStorage.setItem('wallet', JSON.stringify(wallet));
  }

  async loadWallet(): Promise<Wallet | null> {
    const walletData = await AsyncStorage.getItem('wallet');
    return walletData ? JSON.parse(walletData) : null;
  }

  async deleteWallet(): Promise<void> {
    await AsyncStorage.removeItem('wallet');
  }

  setNetwork(network: Network): void {
    this.provider = new ethers.JsonRpcProvider(network.rpcUrl);
    
    if (this.wallet) {
      this.wallet = this.wallet.connect(this.provider);
    }
  }

  async connectWallet(privateKey: string, network: Network): Promise<void> {
    this.provider = new ethers.JsonRpcProvider(network.rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not set');
    
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async sendTransaction(to: string, amount: string): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not connected');
    
    const tx = await this.wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount),
    });
    
    return tx.hash;
  }

  async getTransactionHistory(address: string): Promise<any[]> {
    // This would typically require an API service like Etherscan or Moralis
    // For now, return empty array
    return [];
  }

  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }
}

export default new WalletService();