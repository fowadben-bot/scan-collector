import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Image,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme, categoryColor } from '../theme';
import { getCards } from '../lib/storage';
import { CollectionCard, CardCategory } from '../types/card';

const FILTERS: { key: CardCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'sport', label: 'Sport' },
  { key: 'manga', label: 'Manga' },
  { key: 'autre', label: 'Autre' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [cards, setCards] = useState<CollectionCard[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CardCategory | 'all'>('all');

  const load = useCallback(() => {
    getCards().then(setCards);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      const matchesFilter = filter === 'all' || c.category === filter;
      const matchesQuery =
        !query.trim() ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        (c.set ?? '').toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [cards, query, filter]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Scan Collector</Text>
          <Text style={styles.subtitle}>
            {cards.length} carte{cards.length > 1 ? 's' : ''} dans ta collection
          </Text>
        </View>
        <Pressable
          style={styles.scanButton}
          onPress={() => navigation.navigate('Scan')}
        >
          <Ionicons name="camera" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={theme.colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher une carte, un set..."
          placeholderTextColor={theme.colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.filterChip,
                active && { backgroundColor: theme.colors.blue, borderColor: theme.colors.blue },
              ]}
            >
              <Text style={[styles.filterChipText, active && { color: '#fff' }]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="albums-outline" size={48} color={theme.colors.textMuted} />
          <Text style={styles.emptyText}>
            {cards.length === 0
              ? "Aucune carte pour l'instant. Scanne ta première carte pour commencer."
              : 'Aucun résultat.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ gap: 12 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={load} tintColor={theme.colors.text} />}
          renderItem={({ item }) => (
            <Pressable
              style={styles.cardTile}
              onPress={() => navigation.navigate('CardDetail', { id: item.id })}
            >
              <Image source={{ uri: item.photoUri }} style={styles.cardImage} />
              <View style={[styles.badge, { backgroundColor: categoryColor(item.category) }]}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {item.set ? (
                <Text style={styles.cardSet} numberOfLines={1}>
                  {item.set}
                </Text>
              ) : null}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: 60, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: theme.colors.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: theme.colors.textMuted, fontSize: 13, marginTop: 2 },
  scanButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.blueGlow,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: { flex: 1, color: theme.colors.text, fontSize: 15 },
  filterRow: { flexDirection: 'row', gap: 8, marginVertical: 14 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  filterChipText: { color: theme.colors.textMuted, fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  grid: { paddingBottom: 40 },
  cardTile: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardImage: { width: '100%', aspectRatio: 0.7, borderRadius: 12, backgroundColor: theme.colors.backgroundAlt },
  badge: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  cardTitle: { color: theme.colors.text, fontWeight: '700', fontSize: 14, marginTop: 8 },
  cardSet: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 100 },
  emptyText: { color: theme.colors.textMuted, textAlign: 'center', paddingHorizontal: 40 },
});
