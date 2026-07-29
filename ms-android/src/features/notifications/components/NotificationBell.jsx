import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationBell({ onPress, dark }) {
  const { unreadCount } = useNotifications();

  return (
    <TouchableOpacity
      style={[styles.bellBtn, dark ? styles.bellBtnDark : null]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="notifications-outline" size={22} color={dark ? '#1E293B' : '#FFFFFF'} />
      {unreadCount > 0 ? (
        <View style={[styles.badge, dark ? styles.badgeDark : null]}>
          <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBtnDark: {
    backgroundColor: '#F1F5F9',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D42040',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  badgeDark: {
    borderColor: '#F1F5F9',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
