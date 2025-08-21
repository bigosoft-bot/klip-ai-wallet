import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WalletProvider, useWallet } from './src/context/WalletContext';
import WalletSetupScreen from './src/screens/WalletSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import SendScreen from './src/screens/SendScreen';
import ReceiveScreen from './src/screens/ReceiveScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { wallet } = useWallet();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {wallet ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Send" component={SendScreen} />
            <Stack.Screen name="Receive" component={ReceiveScreen} />
          </>
        ) : (
          <Stack.Screen name="WalletSetup" component={WalletSetupScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <AppNavigator />
    </WalletProvider>
  );
}