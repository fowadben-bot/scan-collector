import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import CardFormScreen from './src/screens/CardFormScreen';
import CardDetailScreen from './src/screens/CardDetailScreen';
import UnlockScreen from './src/screens/UnlockScreen';
import { theme } from './src/theme';
import {
  connectStore,
  disconnectStore,
  isUnlockedLocally,
  listenToPurchaseUpdates,
  restorePurchases,
  requiresUnlock,
} from './src/lib/purchase';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: theme.colors.background,
    card: theme.colors.background,
    text: theme.colors.text,
    border: theme.colors.border,
    primary: theme.colors.blue,
  },
};

export default function App() {
  const [checking, setChecking] = useState(true);
  const [unlocked, setUnlocked] = useState(!requiresUnlock);

  useEffect(() => {
    let removeListener = () => {};

    (async () => {
      if (!requiresUnlock) {
        setChecking(false);
        return;
      }
      try {
        await connectStore();
        removeListener = listenToPurchaseUpdates(() => setUnlocked(true));

        const alreadyUnlocked = await isUnlockedLocally();
        if (alreadyUnlocked) {
          setUnlocked(true);
        } else {
          const owned = await restorePurchases();
          if (owned) setUnlocked(true);
        }
      } finally {
        setChecking(false);
      }
    })();

    return () => {
      removeListener();
      disconnectStore();
    };
  }, []);

  if (checking) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  }

  if (!unlocked) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <UnlockScreen onUnlocked={() => setUnlocked(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="CardForm" component={CardFormScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="CardDetail" component={CardDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
