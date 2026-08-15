import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

export default function ScanScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);

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
      navigation.replace('CardForm', { photoUri: photo.uri });
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
        facing="back"
        onCameraReady={() => setReady(true)}
      >
        <View style={styles.frame} />
      </CameraView>
      <View style={styles.controls}>
        <Pressable style={styles.iconButton} onPress={pickFromLibrary}>
          <Ionicons name="images-outline" size={24} color="#fff" />
        </Pressable>
        <Pressable style={styles.shutter} onPress={takePhoto} disabled={!ready}>
          <View style={styles.shutterInner} />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32 },
  permText: { color: theme.colors.textMuted, textAlign: 'center' },
  permButton: { backgroundColor: theme.colors.blue, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  permButtonText: { color: '#fff', fontWeight: '700' },
  camera: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: '78%',
    aspectRatio: 0.7,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 18,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
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
