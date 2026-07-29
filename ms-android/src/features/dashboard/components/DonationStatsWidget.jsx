import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';

const LIVES_PER_DONATION = 3;

function ImpactChart({ monthlyDonations }) {
  const chartData = monthlyDonations.map((item) => ({
    value: item.count * LIVES_PER_DONATION,
    label: item.month,
  }));

  return (
    <View style={styles.chartWrap}>
      <LineChart
        data={chartData}
        height={140}
        thickness={3}
        color="#D42040"
        curved
        areaChart
        startFillColor="#D42040"
        startOpacity={0.25}
        endFillColor="#D42040"
        endOpacity={0}
        dataPointsColor="#D42040"
        dataPointsRadius={5}
        showValuesAsDataPointsText
        textColor="#1E293B"
        textFontSize={11}
        textShiftY={-14}
        initialSpacing={16}
        endSpacing={16}
        noOfSections={4}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor="#E2E8F0"
        rulesColor="#F1F5F9"
        rulesType="solid"
        yAxisTextStyle={styles.chartAxisText}
        xAxisLabelTextStyle={styles.chartAxisText}
        isAnimated
        animationDuration={600}
      />
    </View>
  );
}

export default function DonationStatsWidget({ loading, error, stats, onRetry }) {
  return (
    <View style={styles.widgetCard}>
      <View style={styles.widgetHeader}>
        <View style={styles.widgetTitleRow}>
          <Ionicons name="stats-chart" size={20} color="#D42040" />
          <Text style={styles.widgetTitle}> Impacto de Donación</Text>
        </View>
        <View style={styles.yearPill}>
          <Text style={styles.yearPillText}>Este año</Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#D42040" style={{ marginVertical: 20 }} />
      ) : error ? (
        <View style={styles.errorRow}>
          <Text style={styles.widgetErrorText}>{error}</Text>
          {onRetry ? (
            <TouchableOpacity onPress={onRetry}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : stats?.monthlyDonations?.length ? (
        <>
          <ImpactChart monthlyDonations={stats.monthlyDonations} />
          <View style={styles.legendRow}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>Vidas impactadas</Text>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>Aún no hay donaciones registradas.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  widgetCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  yearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  yearPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  chartWrap: {
    marginTop: 8,
    alignItems: 'center',
  },
  chartAxisText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    alignSelf: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D42040',
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 12,
  },
  widgetErrorText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  retryText: {
    fontSize: 12,
    color: '#D42040',
    fontWeight: '600',
    marginLeft: 8,
  },
});
