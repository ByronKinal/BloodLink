import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WEEKDAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function isSameDay(a, b) {
  return Boolean(
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  return cells;
}

export default function AppointmentCalendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const cells = buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth());
  const isCurrentMonth =
    viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

  const goPrevMonth = () => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goNextMonth = () => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return (
    <View style={styles.card}>
      <View style={styles.monthHeader}>
        <TouchableOpacity
          style={[styles.navBtn, isCurrentMonth && styles.navBtnDisabled]}
          onPress={goPrevMonth}
          disabled={isCurrentMonth}
        >
          <Ionicons name="chevron-back" size={18} color={isCurrentMonth ? '#CBD5E1' : '#1E293B'} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </Text>
        <TouchableOpacity style={styles.navBtn} onPress={goNextMonth}>
          <Ionicons name="chevron-forward" size={18} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, index) => (
          <Text key={index} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cellDate, index) => {
          if (!cellDate) {
            return <View key={index} style={styles.dayCell} />;
          }

          const isPast = cellDate < today;
          const isSunday = cellDate.getDay() === 0;
          const disabled = isPast || isSunday;
          const isSelected = isSameDay(cellDate, selectedDate);
          const isToday = isSameDay(cellDate, today);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                styles.dayTouchable,
                isSelected && styles.dayCellSelected,
                isToday && !isSelected && styles.dayCellToday,
              ]}
              disabled={disabled}
              onPress={() => onSelectDate(cellDate)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayText, disabled && styles.dayTextDisabled, isSelected && styles.dayTextSelected]}>
                {cellDate.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#D42040' }]} />
          <Text style={styles.legendText}>Seleccionado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FEE2E2' }]} />
          <Text style={styles.legendText}>Hoy</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={[styles.legendText, styles.legendMuted]}>Domingos cerrado</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    elevation: 2,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'capitalize',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  dayTouchable: {
    borderRadius: 100,
  },
  dayCellSelected: {
    backgroundColor: '#D42040',
  },
  dayCellToday: {
    backgroundColor: '#FEE2E2',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  dayTextDisabled: {
    color: '#CBD5E1',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#64748B',
  },
  legendMuted: {
    color: '#94A3B8',
  },
});
