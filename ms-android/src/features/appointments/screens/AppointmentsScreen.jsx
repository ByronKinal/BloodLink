import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppointments } from '../hooks/useAppointments';
import { useCreateAppointment } from '../hooks/useCreateAppointment';
import AppointmentCard from '../components/AppointmentCard';
import CreateAppointmentForm from '../components/CreateAppointmentForm';
import AppointmentEligibilityGate from '../components/AppointmentEligibilityGate';
import AppointmentsEmptyState from '../components/AppointmentsEmptyState';
import TabSwitcher from '../../../shared/components/TabSwitcher';
import LoadingView from '../../../shared/components/LoadingView';
import ErrorView from '../../../shared/components/ErrorView';
import NotificationBell from '../../notifications/components/NotificationBell';
import AppAlertModal from '../../../shared/components/AppAlertModal';

const APPOINTMENT_TABS = [
  { value: 'list', label: 'Mis Citas', icon: 'calendar' },
  { value: 'create', label: 'Agendar Nueva', icon: 'calendar-outline' },
];

export default function AppointmentsScreen({ navigation }) {
  const [mode, setMode] = useState('list'); // 'list' | 'create'
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelErrorMessage, setCancelErrorMessage] = useState(null);
  const { appointments, loading, refreshing, error, refetch, onRefresh, cancelAppointment } = useAppointments();

  const handleCancel = async (appointmentId) => {
    setCancellingId(appointmentId);
    const result = await cancelAppointment(appointmentId);
    setCancellingId(null);
    if (!result.success) {
      setCancelErrorMessage(result.error);
    }
  };

  const handleCreated = () => {
    setMode('list');
    refetch();
  };

  const {
    loadingEligibility,
    hasTriage,
    isApto,
    submitError,
    handleSubmit,
    refetchEligibility,
    ...createFormProps
  } = useCreateAppointment({ onCreated: handleCreated });

  return (
    <ImageBackground
      source={require('../../../../assets/img/bloodlink_triage_background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <View style={styles.headerIconCircle}>
          <Ionicons name="calendar" size={24} color="#D42040" />
          <View style={styles.headerIconBadge}>
            <Ionicons name="water" size={10} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Mis Citas de Donación</Text>
          <Text style={styles.headerSubtitle}>
            Consulta, reprograma o agenda tus citas de donación de sangre.
          </Text>
        </View>
        <NotificationBell dark onPress={() => navigation?.navigate('Notifications')} />
      </View>

      <View style={styles.tabWrap}>
        <TabSwitcher tabs={APPOINTMENT_TABS} activeTab={mode} onChange={setMode} />
      </View>

      {mode === 'create' ? (
        <ScrollView contentContainerStyle={styles.content}>
          {loadingEligibility ? (
            <LoadingView message="Verificando tu elegibilidad..." />
          ) : !isApto ? (
            <AppointmentEligibilityGate hasTriage={hasTriage} onGoToTriage={() => navigation?.navigate('Triage')} />
          ) : (
            <CreateAppointmentForm {...createFormProps} submitError={submitError} onSubmit={handleSubmit} />
          )}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D42040']} />}
        >
          {loading ? (
            <LoadingView message="Cargando tus citas..." />
          ) : error ? (
            <ErrorView message={error} onRetry={refetch} />
          ) : appointments.length === 0 ? (
            <AppointmentsEmptyState onSchedule={() => setMode('create')} />
          ) : (
            appointments.map((item, index) => (
              <AppointmentCard
                key={item._id || item.id || index}
                item={item}
                onCancel={handleCancel}
                isCancelling={cancellingId === (item._id || item.id)}
              />
            ))
          )}
        </ScrollView>
      )}

      <AppAlertModal
        visible={!!cancelErrorMessage}
        title="No se pudo cancelar"
        message={cancelErrorMessage}
        onClose={() => setCancelErrorMessage(null)}
      />
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  headerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  headerIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D42040',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 17,
  },
  tabWrap: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
  },
  content: {
    padding: 16,
  },
});
