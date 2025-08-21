# Multi-Chain Crypto Wallet

A React Native mobile application that supports both Ethereum and BNB Smart Chain networks.

## Features

- ✅ Multi-chain support (Ethereum & BNB Smart Chain)
- ✅ Wallet creation and import
- ✅ Send and receive transactions
- ✅ QR code generation for receiving
- ✅ Network switching
- ✅ Balance checking
- ✅ Transaction history (placeholder)
- ✅ Secure private key storage

## Supported Networks

### Mainnet
- **Ethereum** - ETH transactions and ERC-20 tokens
- **BNB Smart Chain** - BNB transactions and BEP-20 tokens

### Testnet (for development)
- **Ethereum Goerli** - Test ETH transactions
- **BNB Testnet** - Test BNB transactions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Navigate to the project directory:
```bash
cd crypto-wallet
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android
```

## Configuration

### RPC Endpoints

Update the RPC URLs in `src/constants/networks.ts`:

```typescript
// For Ethereum mainnet, you'll need an Infura or Alchemy API key
rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
```

### Security Notes

⚠️ **Important Security Considerations:**

1. **Private Keys**: This app stores private keys locally using AsyncStorage. In production, consider using:
   - iOS Keychain Services
   - Android Keystore
   - Hardware security modules

2. **RPC Endpoints**: Use your own RPC endpoints for production
3. **API Keys**: Never commit API keys to version control
4. **Testing**: Always test on testnets first

## Architecture

```
src/
├── components/          # Reusable UI components
├── constants/          # Network configurations
├── context/           # React Context for state management
├── screens/           # App screens
├── services/          # Blockchain interaction services
└── types/            # TypeScript type definitions
```

## Key Components

- **WalletService**: Handles blockchain interactions using ethers.js
- **WalletContext**: Global state management for wallet data
- **NetworkSelector**: UI for switching between networks
- **QR Code Generation**: For easy address sharing

## Supported Operations

### Wallet Management
- Create new wallet with mnemonic phrase
- Import existing wallet (private key or mnemonic)
- Secure local storage of wallet data

### Transactions
- Send native tokens (ETH/BNB)
- Real-time balance updates
- Transaction confirmation

### Network Features
- Switch between Ethereum and BNB Smart Chain
- Testnet support for development
- Network-specific UI theming

## Development

### Adding New Networks

1. Add network configuration to `src/constants/networks.ts`
2. Update the UI components to handle the new network
3. Test thoroughly on testnet first

### Adding Token Support

The app currently supports native tokens (ETH/BNB). To add ERC-20/BEP-20 token support:

1. Extend the `Token` interface in `src/types/index.ts`
2. Add token contract interaction methods to `WalletService`
3. Update the UI to display token balances

## Building for Production

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test thoroughly on testnets
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This is a demo application for educational purposes. Always audit smart contracts and test thoroughly before using with real funds. The developers are not responsible for any loss of funds.