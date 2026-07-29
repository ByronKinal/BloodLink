import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationBell from '../../notifications/components/NotificationBell';

export default function DashboardHeader({ user, onOpenProfile, onOpenNotifications }) {
  return (
    <ImageBackground
      source={require('../../../../assets/img/bloodlink_refined_background.png')}
      style={styles.header}
      imageStyle={styles.headerImage}
    >
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

        <NotificationBell onPress={onOpenNotifications} />
      </View>

      <View style={styles.headerTop}>
        <View style={styles.greetingWrap}>
          <Text style={styles.userNameText}>Hola, {user?.name || 'Donante'}</Text>
          <Text style={styles.greetingText}>Gracias por ser parte del cambio</Text>
        </View>

        <TouchableOpacity style={styles.avatarWrap} onPress={onOpenProfile}>
          {user?.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={40} color="#FFF" />
          )}
          <View style={styles.avatarBadge}>
            <Ionicons name="water" size={12} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  headerImage: {
    resizeMode: 'cover',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
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
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  brandTextAccent: {
    color: '#F87171',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingWrap: {
    flexShrink: 1,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  greetingText: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 4,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D42040',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
