import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CameraView, useCameraPermissions, type CameraType, type FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

type ScanMode = 'normal' | 'holo';

export default function ScanScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [mode, setMode] = useState<ScanMode>('normal');
  const [zoom, setZoom] = useState(1);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="camera-outline" size={48} color={theme.colors.textMuted} />
        <Text style={styles.permText}>
          Scan Collector a besoin d'accéder à la caméra pour scanner tes cartes.
        </Text>
        <Pressable style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>Autoriser la caméra</Text>
        </Pressable>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo?.uri) {
      navigation.replace('CardForm', {
        photoUri: photo.uri,
        condition: mode === 'holo' ? 'Holo' : undefined,
      });
    }
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      navigation.replace('CardForm', { photoUri: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        zoom={(zoom - 1) / 2}
        onCameraReady={() => setReady(true)}
      >
        <View style={styles.topBar}>
          <Pressable style={styles.iconButtonSmall} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>
          <Pressable
            style={styles.iconButtonSmall}
            onPress={() => setFlash((f) => (f === 'off' ? 'on' : 'off'))}
          >
            <Ionicons name={flash === 'off' ? 'flash-off' : 'flash'} size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.frameWrap}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.hint}>Aligne la carte dans le cadre</Text>
        </View>

        <View style={styles.zoomRow}>
          {[1, 2, 3].map((z) => (
            <Pressable key={z} style={[styles.zoomPill, zoom === z && styles.zoomPillActive]} onPress={() => setZoom(z)}>
              <Text style={[styles.zoomText, zoom === z && styles.zoomTextActive]}>{z}x</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.modeToggle}>
          <Pressable
            style={[styles.modePill, mode === 'normal' && styles.modePillActive]}
            onPress={() => setMode('normal')}
          >
            <Text style={[styles.modeText, mode === 'normal' && styles.modeTextActive]}>Normal</Text>
          </Pressable>
          <Pressable
            style={[styles.modePill, mode === 'holo' && styles.modePillActive]}
            onPress={() => setMode('holo')}
          >
            <Text style={[styles.modeText, mode === 'holo' && styles.modeTextActive]}>Holo</Text>
          </Pressable>
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.iconButton} onPress={pickFromLibrary}>
            <Ionicons name="images-outline" size={24} color="#fff" />
          </Pressable>
          <Pressable style={styles.shutter} onPress={takePhoto} disabled={!ready}>
            <View style={styles.shutterInner} />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
          >
            <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32 },
  permText: { color: theme.colors.textMuted, textAlign: 'center' },
  permButton: { backgroundColor: theme.colors.blue, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  permButtonText: { color: '#fff', fontWeight: '700' },
  camera: { flex: 1 },
  topBar: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  frame: {
    width: '74%',
    aspectRatio: 0.7,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: theme.colors.blueGlow,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },
  hint: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
  },
  zoomRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 10,
    gap: 4,
  },
  zoomPill: {
    width: 30,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomPillActive: { backgroundColor: theme.colors.blue },
  zoomText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700' },
  zoomTextActive: { color: '#fff' },
  modeToggle: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
    gap: 4,
  },
  modePill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modePillActive: { backgroundColor: theme.colors.blue },
  modeText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '700' },
  modeTextActive: { color: '#fff' },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },
});
