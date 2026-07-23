import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileUserCard({ donorName, email, bloodType, rhFactor }) {
  return (
    <View style={styles.userCard}>
      <View style={styles.avatarCircle}>
        <Ionicons name="person" size={40} color="#D42040" />
      </View>
      <Text style={styles.userName}>{donorName}</Text>
      <Text style={styles.userEmail}>{email}</Text>

      <View style={styles.bloodBadgeContainer}>
        <View style={styles.bloodBadge}>
          <Ionicons name="water" size={16} color="#FFF" />
          <Text style={styles.bloodBadgeText}>Tipo: {bloodType} ({rhFactor})</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
