import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AuthPhotoPicker({ value, onChange, error }) {
  const [permissionDenied, setPermissionDenied] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setPermissionDenied(true);
      return;
    }

    setPermissionDenied(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
      legacy: true,
    });

    if (!result.canceled) {
      onChange(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.circle} onPress={pickImage} activeOpacity={0.8}>
        {value ? (
          <Image source={{ uri: value.uri }} style={styles.preview} />
        ) : (
          <Ionicons name="camera-outline" size={32} color="#64748B" />
        )}
      </TouchableOpacity>
      <Text style={styles.label}>Seleccionar foto</Text>
      {permissionDenied ? (
        <Text style={styles.errorText}>Necesitamos acceso a tus fotos para continuar.</Text>
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D42040',
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  preview: {
    width: 96,
    height: 96,
  },
  label: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748B',
  },
  errorText: {
    color: '#D42040',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
