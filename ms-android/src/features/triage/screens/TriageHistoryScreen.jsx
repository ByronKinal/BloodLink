import React from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTriage } from '../hooks/useTriage';
import { isTriageApto } from '../../../shared/utils/triageEligibility';
import LoadingView from '../../../shared/components/LoadingView';
import ErrorView from '../../../shared/components/ErrorView';
import EmptyView from '../../../shared/components/EmptyView';

function formatDate(dateStr) {
  if (!dateStr) return { date: '—', time: '' };
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return { date: dateStr, time: '' };
  return {
    date: parsed.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: parsed.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
  };
}

function HistoryItem({ item }) {
  const isEligible = isTriageApto(item);
  const { date, time } = formatDate(item.createdAt);
  const observation = item?.evaluation?.reasons?.[0] || 'Sin observaciones';

  return (
    <View style={styles.card}>
      <View style={styles.cardIconCircle}>
        <Ionicons name="calendar-outline" size={20} color="#D42040" />
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardDate}>{date}</Text>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={12} color="#94A3B8" />
          <Text style={styles.cardTime}>{time}</Text>
        </View>

        <View
          style={[styles.statusPill, { backgroundColor: isEligible ? '#DCFCE7' : '#FEE2E2' }]}
        >
          <Ionicons
            name={isEligible ? 'checkmark-circle' : 'close-circle'}
            size={14}
            color={isEligible ? '#16A34A' : '#DC2626'}
          />
          <Text style={[styles.statusPillText, { color: isEligible ? '#16A34A' : '#DC2626' }]}>
            {isEligible ? 'Apto para Donar' : 'No Apto'}
          </Text>
        </View>

        <Text style={styles.observation} numberOfLines={2}>
          {observation}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </View>
  );
}

export default function TriageHistoryScreen({ navigation }) {
  const { history, loadingHistory, historyError, refetchHistory } = useTriage();

  return (
    <ImageBackground
      source={require('../../../../assets/img/bloodlink_triage_background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Triaje</Text>
      </View>

      {loadingHistory ? (
        <LoadingView message="Cargando historial..." />
      ) : historyError ? (
        <ErrorView message={historyError} onRetry={refetchHistory} />
      ) : history.length === 0 ? (
        <EmptyView
          icon="clipboard-outline"
          title="Sin evaluaciones registradas"
          subtitle="Completa tu primer cuestionario de triage para registrar tu estado."
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => item._id || item.id || String(index)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.summaryCard}>
              <Ionicons name="water" size={90} color="rgba(212,32,64,0.08)" style={styles.watermark} />

              <View style={styles.summaryIconCircle}>
                <Ionicons name="document-text-outline" size={26} color="#D42040" />
                <View style={styles.summaryIconBadge}>
                  <Ionicons name="pulse" size={11} color="#FFFFFF" />
                </View>
              </View>
              <View>
                <Text style={styles.summaryLabel}>Total de Evaluaciones</Text>
                <Text style={styles.summaryValue}>{history.length}</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => <HistoryItem item={item} />}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  watermark: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  summaryIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  summaryIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D42040',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    elevation: 1,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardInfo: {
    flex: 1,
  },
  cardDate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  observation: {
    fontSize: 12,
    color: '#64748B',
  },
});
