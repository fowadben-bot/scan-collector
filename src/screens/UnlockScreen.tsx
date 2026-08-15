import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import {
  connectStore,
  fetchUnlockProduct,
  purchaseUnlock,
  restorePurchases,
} from '../lib/purchase';

interface Props {
  onUnlocked: () => void;
}

export default function UnlockScreen({ onUnlocked }: Props) {
  const [price, setPrice] = useState('0,99 €');
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await connectStore();
        const product = await fetchUnlockProduct();
        if (product?.localizedPrice) setPrice(product.localizedPrice);
      } catch {
        // On garde le prix par défaut affiché si le store n'est pas joignable (ex: pas encore publié).
      }
    })();
  }, []);

  const handleUnlock = async () => {
    setLoading(true);
    try {
      await purchaseUnlock();
    } catch {
      Alert.alert('Achat impossible', 'Réessaie dans quelques instants.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const owned = await restorePurchases();
      if (owned) {
        onUnlocked();
      } else {
        Alert.alert('Aucun achat trouvé', "Aucun déblocage n'est associé à ce compte Google Play.");
      }
    } catch {
      Alert.alert('Restauration impossible', 'Réessaie dans quelques instants.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="lock-closed" size={40} color={theme.colors.blue} />
      </View>
      <Text style={styles.title}>Débloquer Scan Collector</Text>
      <Text style={styles.subtitle}>
        Un achat unique pour scanner et organiser toute ta collection de cartes, sans limite.
      </Text>

      <Pressable style={styles.unlockButton} onPress={handleUnlock} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.unlockText}>Débloquer — {price}</Text>
        )}
      </Pressable>

      <Pressable style={styles.restoreButton} onPress={handleRestore} disabled={restoring}>
        {restoring ? (
          <ActivityIndicator color={theme.colors.textMuted} />
        ) : (
          <Text style={styles.restoreText}>Restaurer mon achat</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  unlockButton: {
    width: '100%',
    backgroundColor: theme.colors.blue,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  restoreButton: { marginTop: 16, paddingVertical: 10 },
  restoreText: { color: theme.colors.textMuted, fontSize: 14, textDecorationLine: 'underline' },
});
