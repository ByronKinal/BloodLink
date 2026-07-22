import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfilePicturePicker({ value, onChange, error }) {
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
    });

    if (!result.canceled) {
      onChange(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto de perfil</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={pickImage}>
        {value ? (
          <Image source={{ uri: value.uri }} style={styles.preview} />
        ) : (
          <Text style={styles.pickerText}>Seleccionar foto</Text>
        )}
      </TouchableOpacity>
      {permissionDenied ? (
        <Text style={styles.errorText}>Necesitamos acceso a tus fotos para continuar.</Text>
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  pickerButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  preview: {
    width: 96,
    height: 96,
  },
  pickerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  errorText: {
    color: '#D42040',
    fontSize: 12,
    marginTop: 4,
  },
});
