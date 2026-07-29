import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../hooks/useNotifications';
import LoadingView from '../../../shared/components/LoadingView';
import ErrorView from '../../../shared/components/ErrorView';
import EmptyView from '../../../shared/components/EmptyView';

const TYPE_ICON = {
  APPOINTMENT_CONFIRMED: { name: 'calendar', color: '#16A34A' },
  APPOINTMENT_CANCELLED: { name: 'calendar-outline', color: '#DC2626' },
  TRIAGE_RESULT: { name: 'clipboard', color: '#D42040' },
};

function NotificationItem({ notification, onPress }) {
  const icon = TYPE_ICON[notification.type] || { name: 'notifications', color: '#64748B' };

  return (
    <TouchableOpacity
      style={[styles.item, !notification.isRead && styles.itemUnread]}
      onPress={() => onPress(notification)}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${icon.color}1A` }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{notification.title}</Text>
        <Text style={styles.itemMessage}>{notification.message}</Text>
      </View>
      {!notification.isRead ? <View style={styles.unreadDot} /> : null}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen({ navigation }) {
  const { notifications, loading, error, refetch, markAsRead, markAllAsRead } = useNotifications();

  const handlePress = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity onPress={markAllAsRead} hitSlop={8}>
          <Text style={styles.markAllText}>Marcar todas</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingView message="Cargando notificaciones..." />
      ) : error ? (
        <ErrorView message={error} onRetry={refetch} />
      ) : notifications.length === 0 ? (
        <EmptyView
          icon="notifications-outline"
          title="Sin notificaciones"
          subtitle="Aquí verás avisos sobre tus citas y resultados de Triage."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem notification={item} onPress={handlePress} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  markAllText: {
    fontSize: 12,
    color: '#F87171',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  itemUnread: {
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  itemMessage: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D42040',
    marginLeft: 8,
  },
});
