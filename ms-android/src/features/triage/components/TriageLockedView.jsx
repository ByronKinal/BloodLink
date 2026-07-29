import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

const RING_SIZE = 216;
const STROKE_WIDTH = 14;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function splitRemaining(remainingMs = 0) {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
}

function CountdownRing({ progress, hours, minutes, seconds }) {
  const clamped = Math.min(1, Math.max(0, progress));
  const dashOffset = CIRCUMFERENCE * (1 - clamped);

  return (
    <View style={styles.ringOuter}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke="#E2E8F0"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke="#D42040"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          fill="none"
          rotation="-90"
          origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
        />
      </Svg>

      <View style={styles.ringCenter}>
        <View style={styles.clockIconWrap}>
          <Ionicons name="time-outline" size={20} color="#94A3B8" />
        </View>
        <Text style={styles.ringLabel}>TIEMPO RESTANTE</Text>
        <View style={styles.timeRow}>
          <Text style={styles.timeValue}>{hours}</Text>
          <Text style={styles.timeColon}>:</Text>
          <Text style={styles.timeValue}>{minutes}</Text>
          <Text style={styles.timeColon}>:</Text>
          <Text style={styles.timeValue}>{seconds}</Text>
        </View>
        <View style={styles.unitRow}>
          <Text style={styles.unitLabel}>HRS</Text>
          <View style={styles.unitSpacer} />
          <Text style={styles.unitLabel}>MIN</Text>
          <View style={styles.unitSpacer} />
          <Text style={styles.unitLabel}>SEG</Text>
        </View>
      </View>
    </View>
  );
}

function PulseBars() {
  const heights = [6, 10, 16, 22, 14, 20, 10, 16, 8, 12];
  return (
    <View style={styles.pulseBarsRow}>
      {heights.map((h, index) => (
        <View
          key={index}
          style={[styles.pulseBar, { height: h, opacity: 0.3 + (index % 3) * 0.2 }]}
        />
      ))}
    </View>
  );
}

export default function TriageLockedView({ remainingMs, progress = 0 }) {
  const { hours, minutes, seconds } = splitRemaining(remainingMs);

  return (
    <View style={styles.wrapper}>
      <CountdownRing progress={progress} hours={hours} minutes={minutes} seconds={seconds} />

      <View style={styles.waitCard}>
        <View style={styles.waitIconCircle}>
          <Ionicons name="pulse" size={20} color="#D42040" />
        </View>
        <View style={styles.waitTextWrap}>
          <Text style={styles.waitTitle}>Formulario en Espera</Text>
          <Text style={styles.waitSubtitle}>
            Debes esperar el tiempo restante para poder continuar con el formulario.
          </Text>
        </View>
        <PulseBars />
      </View>

      <View style={styles.disabledButton}>
        <Ionicons name="lock-closed" size={16} color="#94A3B8" />
        <Text style={styles.disabledButtonText}>Llenar Formulario</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  ringOuter: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockIconWrap: {
    marginBottom: 6,
  },
  ringLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    minWidth: 50,
    textAlign: 'center',
  },
  timeColon: {
    fontSize: 26,
    fontWeight: '800',
    color: '#CBD5E1',
    marginHorizontal: 2,
  },
  unitRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  unitLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    minWidth: 50,
    textAlign: 'center',
  },
  unitSpacer: {
    width: 12,
  },
  waitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  waitIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  waitTextWrap: {
    flex: 1,
  },
  waitTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  waitSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },
  pulseBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    marginLeft: 10,
  },
  pulseBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#D42040',
  },
  disabledButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
  },
  disabledButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
