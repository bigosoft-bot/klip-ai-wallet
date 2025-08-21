import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { NETWORKS } from '../constants/networks';
import { useWallet } from '../context/WalletContext';
import { Network } from '../types';

interface NetworkSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ visible, onClose }) => {
  const { currentNetwork, switchNetwork } = useWallet();

  const handleNetworkSelect = async (networkId: string) => {
    await switchNetwork(networkId);
    onClose();
  };

  const renderNetworkItem = ({ item }: { item: Network }) => (
    <TouchableOpacity
      style={[
        styles.networkItem,
        currentNetwork.id === item.id && styles.selectedNetwork
      ]}
      onPress={() => handleNetworkSelect(item.id)}
    >
      <View style={[styles.networkDot, { backgroundColor: item.color }]} />
      <View style={styles.networkInfo}>
        <Text style={styles.networkName}>{item.name}</Text>
        <Text style={styles.networkSymbol}>{item.symbol}</Text>
      </View>
      {currentNetwork.id === item.id && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Network</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={Object.values(NETWORKS)}
            renderItem={renderNetworkItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
  list: {
    padding: 10,
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#f8f9fa',
  },
  selectedNetwork: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  networkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  networkInfo: {
    flex: 1,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  networkSymbol: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NetworkSelector;