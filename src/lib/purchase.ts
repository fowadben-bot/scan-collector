import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  getAvailablePurchases,
  type Product,
  type Purchase,
} from 'react-native-iap';

export const UNLOCK_PRODUCT_ID = 'unlock_full_version';
const UNLOCKED_STORAGE_KEY = 'scan-collector:unlocked';

// Le paywall ne s'applique qu'à Android : sur iOS l'app est déjà payante au téléchargement.
export const requiresUnlock = Platform.OS === 'android';

export async function isUnlockedLocally(): Promise<boolean> {
  if (!requiresUnlock) return true;
  const flag = await AsyncStorage.getItem(UNLOCKED_STORAGE_KEY);
  return flag === 'true';
}

async function markUnlocked() {
  await AsyncStorage.setItem(UNLOCKED_STORAGE_KEY, 'true');
}

export async function connectStore() {
  if (!requiresUnlock) return;
  await initConnection();
}

export async function disconnectStore() {
  if (!requiresUnlock) return;
  await endConnection();
}

export async function fetchUnlockProduct(): Promise<Product | null> {
  if (!requiresUnlock) return null;
  const products = await getProducts({ skus: [UNLOCK_PRODUCT_ID] });
  return products?.[0] ?? null;
}

// Vérifie auprès de Google Play si l'achat a déjà été effectué (réinstallation, nouvel appareil...).
export async function restorePurchases(): Promise<boolean> {
  if (!requiresUnlock) return true;
  const purchases = await getAvailablePurchases();
  const owned = purchases.some((p) => p.productId === UNLOCK_PRODUCT_ID);
  if (owned) await markUnlocked();
  return owned;
}

export async function purchaseUnlock() {
  if (!requiresUnlock) return;
  await requestPurchase({ sku: UNLOCK_PRODUCT_ID });
}

export function listenToPurchaseUpdates(onUnlocked: () => void) {
  if (!requiresUnlock) return () => {};

  const updateSub = purchaseUpdatedListener(async (purchase: Purchase) => {
    if (purchase.productId === UNLOCK_PRODUCT_ID) {
      await markUnlocked();
      try {
        await finishTransaction({ purchase, isConsumable: false });
      } catch {
        // La transaction sera re-proposée par le store si la finalisation échoue.
      }
      onUnlocked();
    }
  });

  const errorSub = purchaseErrorListener(() => {
    // L'utilisateur peut réessayer depuis l'écran de déblocage.
  });

  return () => {
    updateSub.remove();
    errorSub.remove();
  };
}
