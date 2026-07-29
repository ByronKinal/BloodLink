import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { useAppointments } from '../hooks/useAppointments';
import { useCreateAppointment } from '../hooks/useCreateAppointment';
import AppointmentCard from '../components/AppointmentCard';
import CreateAppointmentForm from '../components/CreateAppointmentForm';
import AppointmentEligibilityGate from '../components/AppointmentEligibilityGate';
import TabSwitcher from '../../../shared/components/TabSwitcher';
import LoadingView from '../../../shared/components/LoadingView';
import ErrorView from '../../../shared/components/ErrorView';
import EmptyView from '../../../shared/components/EmptyView';

const APPOINTMENT_TABS = [
  { value: 'list', label: 'Mis Citas' },
  { value: 'create', label: 'Agendar Nueva' },
];

export default function AppointmentsScreen({ navigation }) {
  const [mode, setMode] = useState('list'); // 'list' | 'create'
  const { appointments, loading, refreshing, error, refetch, onRefresh } = useAppointments();

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Citas de Donación</Text>
        <Text style={styles.headerSubtitle}>Gestiona tus agendamientos de donación de sangre</Text>

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
            <EmptyView
              icon="calendar-outline"
              title="Aún no tienes citas agendadas"
              subtitle="Programa una nueva cita en tu centro de donación más cercano."
              actionLabel="Agendar mi cita"
              onAction={() => setMode('create')}
            />
          ) : (
            appointments.map((item, index) => <AppointmentCard key={item._id || item.id || index} item={item} />)
          )}
        </ScrollView>
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
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
});
