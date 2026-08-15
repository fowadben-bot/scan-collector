import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { theme, categoryColor } from '../theme';
import { addCard, updateCard } from '../lib/storage';
import { CardCategory, CollectionCard } from '../types/card';

const CATEGORIES: CardCategory[] = ['sport', 'manga', 'autre'];

export default function CardFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editing: CollectionCard | undefined = route.params?.card;
  const photoUri: string = editing?.photoUri ?? route.params?.photoUri;

  const [title, setTitle] = useState(editing?.title ?? '');
  const [category, setCategory] = useState<CardCategory>(editing?.category ?? 'sport');
  const [set, setSet] = useState(editing?.set ?? '');
  const [condition, setCondition] = useState(editing?.condition ?? route.params?.condition ?? '');
  const [notes, setNotes] = useState(editing?.notes ?? '');

  const save = async () => {
    if (!title.trim()) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (editing) {
      await updateCard(editing.id, { title, category, set, condition, notes });
    } else {
      await addCard({
        id: `${Date.now()}`,
        photoUri,
        title,
        category,
        set,
        condition,
        notes,
        favorite: false,
        createdAt: Date.now(),
      });
    }
    navigation.popToTop();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: photoUri }} style={styles.preview} />

        <Text style={styles.label}>Nom de la carte</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex : Charizard, LeBron James Prizm..."
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.chip,
                  active && { backgroundColor: categoryColor(c), borderColor: categoryColor(c) },
                ]}
              >
                <Text style={[styles.chipText, active && { color: '#fff' }]}>{c}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Set / édition</Text>
        <TextInput
          value={set}
          onChangeText={setSet}
          placeholder="Ex : Base Set 1999, Panini Prizm 2023..."
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>État</Text>
        <TextInput
          value={condition}
          onChangeText={setCondition}
          placeholder="Ex : Near Mint, PSA 9..."
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes personnelles..."
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
          multiline
        />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Annuler</Text>
        </Pressable>
        <Pressable style={[styles.saveButton, !title.trim() && { opacity: 0.5 }]} onPress={save} disabled={!title.trim()}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 20, paddingTop: 60, paddingBottom: 20 },
  preview: {
    width: '100%',
    aspectRatio: 0.9,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.card,
    marginBottom: 20,
  },
  label: { color: theme.colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.colors.text,
    fontSize: 15,
  },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  chipText: { color: theme.colors.textMuted, fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  cancelText: { color: theme.colors.textMuted, fontWeight: '700' },
  saveButton: { flex: 2, paddingVertical: 14, borderRadius: 24, backgroundColor: theme.colors.blue, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
});
