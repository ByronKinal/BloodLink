import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import NotificationBell from '../../notifications/components/NotificationBell';

export default function DashboardHeader({ user, onOpenProfile, onOpenNotifications }) {
  const initial = (user?.name || 'D').trim().charAt(0).toUpperCase();

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.brandLeft}>
          <Image
            source={require('../../../../assets/img/bloodlink_icon.png')}
            style={styles.brandIcon}
            resizeMode="contain"
          />
          <Text style={styles.brandText}>
            Blood<Text style={styles.brandTextAccent}>Link</Text>
          </Text>
        </View>

        <View style={styles.rightRow}>
          <NotificationBell dark onPress={onOpenNotifications} />
          <TouchableOpacity style={styles.avatarWrap} onPress={onOpenProfile} activeOpacity={0.85}>
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitial}>{initial}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.greetingWrap}>
        <Text style={styles.userNameText}>Hola, {user?.name || 'Donante'}</Text>
        <Text style={styles.greetingText}>Gracias por ser parte del cambio</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  brandTextAccent: {
    color: '#D42040',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D42040',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  greetingWrap: {
    flexShrink: 1,
  },
  userNameText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1E293B',
  },
  greetingText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
});
