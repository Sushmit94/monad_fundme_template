import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { ethers } from 'ethers';
import { getContract, getProvider, CONTRACT_ADDRESS, MONAD_CONFIG } from '../utils/web3';

export default function FundMeScreen() {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [totalFunds, setTotalFunds] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContractData();
  }, []);

  const loadContractData = async () => {
    try {
      const provider = getProvider();
      const contract = getContract(provider);
      const funds = await contract.totalFunds();
      setTotalFunds(ethers.formatEther(funds));
    } catch (error) {
      console.error('Error loading contract data:', error);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      
      // For mobile: Use WalletConnect deep link
      const wcUri = `wc:connect?uri=${encodeURIComponent('your-walletconnect-uri')}`;
      
      // Open MetaMask mobile app
      const metamaskDeepLink = `https://metamask.app.link/dapp/${CONTRACT_ADDRESS}`;
      
      const canOpen = await Linking.canOpenURL(metamaskDeepLink);
      
      if (canOpen) {
        await Linking.openURL(metamaskDeepLink);
        // In production, you'd use WalletConnect to get the actual address
        // For now, we'll simulate connection
        Alert.alert(
          'Connect Wallet',
          'Please connect via MetaMask mobile app',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Simulate Connection',
              onPress: () => {
                // Simulate wallet connection for testing
                const demoAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
                setAccount(demoAddress);
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Please install MetaMask mobile app');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async () => {
    if (!account) {
      Alert.alert('Error', 'Please connect wallet first');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      
      // Build transaction data
      const contract = getContract(getProvider());
      const data = contract.interface.encodeFunctionData('fund');
      
      // Create deep link for MetaMask mobile
      const tx = {
        to: CONTRACT_ADDRESS,
        value: ethers.parseEther(amount).toString(),
        data: data,
        chainId: MONAD_CONFIG.chainId,
      };
      
      // Open MetaMask with transaction
      const metamaskDeepLink = `https://metamask.app.link/send/${CONTRACT_ADDRESS}@${MONAD_CONFIG.chainId}/transfer?address=${CONTRACT_ADDRESS}&uint256=${ethers.parseEther(amount).toString()}`;
      
      await Linking.openURL(metamaskDeepLink);
      
      Alert.alert(
        'Transaction Sent',
        'Please confirm the transaction in MetaMask mobile app',
        [
          {
            text: 'OK',
            onPress: () => {
              setAmount('');
              // Reload data after a delay to allow transaction to be mined
              setTimeout(() => loadContractData(), 5000);
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const openExplorer = () => {
    Linking.openURL(`${MONAD_CONFIG.blockExplorerUrl}/address/${CONTRACT_ADDRESS}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FundMe DApp</Text>
      <Text style={styles.subtitle}>Monad Network</Text>

      {!account ? (
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleConnect}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Connected Account:</Text>
            <Text style={styles.address}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Total Funds in Contract:</Text>
            <Text style={styles.value}>{totalFunds} MON</Text>
          </View>

          <View style={styles.fundSection}>
            <Text style={styles.label}>Fund Amount (MON):</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.01"
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TouchableOpacity 
              style={[styles.button, styles.fundButton]} 
              onPress={handleFund}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : 'Fund Contract'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.contractBox} onPress={openExplorer}>
            <Text style={styles.contractLabel}>Contract Address:</Text>
            <Text style={styles.contractAddress}>{CONTRACT_ADDRESS}</Text>
            <Text style={styles.explorerLink}>View on Explorer →</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  fundButton: {
    backgroundColor: '#10b981',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#1a1f3a',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    color: '#10b981',
    fontWeight: 'bold',
  },
  fundSection: {
    backgroundColor: '#1a1f3a',
    padding: 20,
    borderRadius: 12,
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#0a0e27',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  contractBox: {
    backgroundColor: '#1a1f3a',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  contractLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  contractAddress: {
    fontSize: 12,
    color: '#6366f1',
    fontFamily: 'monospace',
  },
  explorerLink: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 8,
  },
});