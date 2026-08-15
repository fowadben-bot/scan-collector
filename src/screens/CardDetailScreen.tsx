import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Alert, Linking } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme, categoryColor } from '../theme';
import { getCards, deleteCard, updateCard } from '../lib/storage';
import { CollectionCard } from '../types/card';

export default function CardDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params;
  const [card, setCard] = useState<CollectionCard | null>(null);

  useFocusEffect(
    useCallback(() => {
      getCards().then((cards) => {
        setCard(cards.find((c) => c.id === id) ?? null);
      });
    }, [id])
  );

  if (!card) return <View style={styles.container} />;

  const toggleFavorite = async () => {
    await updateCard(card.id, { favorite: !card.favorite });
    setCard({ ...card, favorite: !card.favorite });
  };

  const remove = () => {
    Alert.alert('Supprimer cette carte ?', 'Cette action est définitive.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteCard(card.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const searchQuery = [card.title, card.set].filter(Boolean).join(' ').trim();
  const encodedQuery = encodeURIComponent(searchQuery);

  const openExternalSearch = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Impossible d’ouvrir le lien', 'Vérifie ta connexion et réessaie.')
    );
  };

  const openEbay = () =>
    openExternalSearch(`https://www.ebay.fr/sch/i.html?_nkw=${encodedQuery}`);

  const openCardmarket = () =>
    openExternalSearch(`https://www.cardmarket.com/en/Pokemon/Products/Search?searchString=${encodedQuery}`);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: card.photoUri }} style={styles.image} />
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>
        <Pressable style={styles.favButton} onPress={toggleFavorite}>
          <Ionicons name={card.favorite ? 'star' : 'star-outline'} size={20} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: categoryColor(card.category) }]}>
          <Text style={styles.badgeText}>{card.category}</Text>
        </View>
        <Text style={styles.title}>{card.title}</Text>

        {card.set ? (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Set</Text>
            <Text style={styles.rowValue}>{card.set}</Text>
          </View>
        ) : null}
        {card.condition ? (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>État</Text>
            <Text style={styles.rowValue}>{card.condition}</Text>
          </View>
        ) : null}
        {card.notes ? (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.rowLabel}>Notes</Text>
            <Text style={styles.notes}>{card.notes}</Text>
          </View>
        ) : null}

        <View style={styles.valueSection}>
          <Text style={styles.rowLabel}>Vérifier la valeur</Text>
          <View style={styles.valueLinks}>
            <Pressable style={styles.valueLinkButton} onPress={openEbay}>
              <Ionicons name="pricetag-outline" size={16} color={theme.colors.text} />
              <Text style={styles.valueLinkText}>eBay</Text>
              <Ionicons name="open-outline" size={14} color={theme.colors.textMuted} />
            </Pressable>
            {card.category === 'manga' ? (
              <Pressable style={styles.valueLinkButton} onPress={openCardmarket}>
                <Ionicons name="pricetag-outline" size={16} color={theme.colors.text} />
                <Text style={styles.valueLinkText}>Cardmarket</Text>
                <Ionicons name="open-outline" size={14} color={theme.colors.textMuted} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.editButton}
            onPress={() => navigation.navigate('CardForm', { card })}
          >
            <Ionicons name="pencil" size={16} color="#fff" />
            <Text style={styles.editText}>Modifier</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={remove}>
            <Ionicons name="trash-outline" size={16} color={theme.colors.red} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  imageWrap: { width: '100%', aspectRatio: 0.85 },
  image: { width: '100%', height: '100%', backgroundColor: theme.colors.card },
  backButton: {
    position: 'absolute',
    top: 56,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favButton: {
    position: 'absolute',
    top: 56,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 20 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  title: { color: theme.colors.text, fontSize: 24, fontWeight: '800', marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowLabel: { color: theme.colors.textMuted, fontSize: 14 },
  rowValue: { color: theme.colors.text, fontSize: 14, fontWeight: '600' },
  notes: { color: theme.colors.text, fontSize: 14, marginTop: 4, lineHeight: 20 },
  valueSection: { marginTop: 24 },
  valueLinks: { flexDirection: 'row', gap: 10, marginTop: 10 },
  valueLinkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    borderRadius: 14,
  },
  valueLinkText: { color: theme.colors.text, fontSize: 13, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blue,
    paddingVertical: 14,
    borderRadius: 24,
  },
  editText: { color: '#fff', fontWeight: '700' },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
