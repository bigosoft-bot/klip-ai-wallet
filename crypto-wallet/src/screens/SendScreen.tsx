import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useWallet } from '../context/WalletContext';
import WalletService from '../services/WalletService';

interface SendScreenProps {
  navigation: any;
}

const SendScreen: React.FC<SendScreenProps> = ({ navigation }) => {
  const { currentNetwork, balance, sendTransaction, isLoading } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = async () => {
    if (!recipient.trim()) {
      Alert.alert('Error', 'Please enter a recipient address');
      return;
    }

    if (!WalletService.isValidAddress(recipient)) {
      Alert.alert('Error', 'Please enter a valid address');
      return;
    }

    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert(
      'Confirm Transaction',
      `Send ${amount} ${currentNetwork.symbol} to ${WalletService.formatAddress(recipient)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: confirmSend },
      ]
    );
  };

  const confirmSend = async () => {
    try {
      const txHash = await sendTransaction(recipient, amount);
      Alert.alert(
        'Transaction Sent',
        `Transaction hash: ${txHash}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Transaction failed');
    }
  };

  const setMaxAmount = () => {
    // Leave some for gas fees
    const maxAmount = Math.max(0, parseFloat(balance) - 0.001);
    setAmount(maxAmount.toString());
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Send {currentNetwork.symbol}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Address</Text>
            <TextInput
              style={styles.input}
              placeholder="0x..."
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.amountHeader}>
              <Text style={styles.label}>Amount</Text>
              <TouchableOpacity onPress={setMaxAmount}>
                <Text style={styles.maxButton}>MAX</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="0.0"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <Text style={styles.balanceText}>
              Balance: {parseFloat(balance).toFixed(4)} {currentNetwork.symbol}
            </Text>
          </View>

          <View style={styles.networkInfo}>
            <View style={[styles.networkDot, { backgroundColor: currentNetwork.color }]} />
            <Text style={styles.networkText}>
              Sending on {currentNetwork.name}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.disabledButton]}
          onPress={handleSend}
          disabled={isLoading}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? 'Sending...' : 'Send Transaction'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maxButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
  },
  balanceText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  networkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  networkText: {
    fontSize: 14,
    color: '#666',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SendScreen;