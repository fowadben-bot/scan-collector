import AsyncStorage from '@react-native-async-storage/async-storage';
import { CollectionCard } from '../types/card';

const STORAGE_KEY = 'scan-collector:cards';

export async function getCards(): Promise<CollectionCard[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CollectionCard[];
  } catch {
    return [];
  }
}

async function saveCards(cards: CollectionCard[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export async function addCard(card: CollectionCard): Promise<void> {
  const cards = await getCards();
  cards.unshift(card);
  await saveCards(cards);
}

export async function updateCard(id: string, patch: Partial<CollectionCard>): Promise<void> {
  const cards = await getCards();
  const next = cards.map((c) => (c.id === id ? { ...c, ...patch } : c));
  await saveCards(next);
}

export async function deleteCard(id: string): Promise<void> {
  const cards = await getCards();
  await saveCards(cards.filter((c) => c.id !== id));
}
