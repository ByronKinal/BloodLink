import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileUserCard({ donorName, email, bloodType, profilePicture, uploading, onChangePhoto }) {
  const pickImage = async () => {
    if (uploading) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
      legacy: true,
    });

    if (!result.canceled) {
      onChangePhoto?.(result.assets[0]);
    }
  };

  return (
    <View style={styles.userCard}>
      <TouchableOpacity style={styles.avatarCircle} onPress={pickImage} activeOpacity={0.85}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person" size={40} color="#D42040" />
        )}

        {uploading ? (
          <View style={styles.avatarOverlay}>
            <ActivityIndicator size="small" color="#FFFFFF" />
          </View>
        ) : null}

        <View style={styles.editBadge}>
          <Ionicons name="camera" size={14} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <Text style={styles.userName}>{donorName}</Text>
      <Text style={styles.userEmail}>{email}</Text>

      <View style={styles.bloodBadgeContainer}>
        <View style={styles.bloodBadge}>
          <Ionicons name="water" size={16} color="#FFF" />
          <Text style={styles.bloodBadgeText}>Tipo: {bloodType}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'visible',
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 44,
    backgroundColor: 'rgba(15,23,42,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D42040',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  bloodBadgeContainer: {
    marginTop: 14,
  },
  bloodBadge: {
    backgroundColor: '#D42040',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bloodBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 6,
  },
});
