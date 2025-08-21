import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Share,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useWallet } from '../context/WalletContext';

interface ReceiveScreenProps {
  navigation: any;
}

const ReceiveScreen: React.FC<ReceiveScreenProps> = ({ navigation }) => {
  const { wallet, currentNetwork } = useWallet();

  const handleCopyAddress = async () => {
    if (wallet) {
      // In a real app, you'd use Clipboard from @react-native-clipboard/clipboard
      Alert.alert('Address Copied', 'Wallet address copied to clipboard');
    }
  };

  const handleShareAddress = async () => {
    if (wallet) {
      try {
        await Share.share({
          message: `My ${currentNetwork.name} wallet address: ${wallet.address}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (!wallet) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Receive {currentNetwork.symbol}</Text>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={wallet.address}
              size={200}
              backgroundColor="white"
              color="black"
            />
          </View>
          
          <View style={styles.networkBadge}>
            <View style={[styles.networkDot, { backgroundColor: currentNetwork.color }]} />
            <Text style={styles.networkText}>{currentNetwork.name}</Text>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Your Wallet Address</Text>
          <Text style={styles.address}>{wallet.address}</Text>
          
          <Text style={styles.warning}>
            ⚠️ Only send {currentNetwork.symbol} and {currentNetwork.name} tokens to this address
          </Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyAddress}
          >
            <Text style={styles.copyButtonText}>Copy Address</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareAddress}
          >
            <Text style={styles.shareButtonText}>Share Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  qrWrapper: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addressContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#666',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  warning: {
    fontSize: 12,
    color: '#ff6b6b',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttons: {
    flexDirection: 'row',
    gap: 15,
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  copyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReceiveScreen;