import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardHeader({ user, onOpenProfile }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greetingText}>¡Hola de nuevo! 👋</Text>
          <Text style={styles.userNameText}>{user?.name || 'Donante de Sangre'}</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={onOpenProfile}>
          <Ionicons name="person-circle-outline" size={36} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  profileBtn: {
    padding: 4,
  },
});
