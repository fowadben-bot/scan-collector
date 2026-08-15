# Scan Collector

Application mobile (Expo / React Native) pour scanner, cataloguer et organiser une collection de cartes (sport, manga, autres).

## Fonctionnalités
- Scan d'une carte via l'appareil photo ou import depuis la photothèque
- Catalogue local (hors-ligne, AsyncStorage — aucune donnée envoyée à un serveur)
- Catégories (sport / manga / autre), recherche, favoris
- Fiche détaillée par carte (set, état, notes) avec édition / suppression

## Stack
- Expo (React Native, TypeScript)
- React Navigation
- expo-camera / expo-image-picker
- @react-native-async-storage/async-storage

## Développement

```bash
npm install
npx expo start
```

## Build (EAS)

```bash
eas build --platform ios
eas build --platform android
```

## Confidentialité
Voir la politique de confidentialité hébergée via GitHub Pages : `docs/index.html`.
