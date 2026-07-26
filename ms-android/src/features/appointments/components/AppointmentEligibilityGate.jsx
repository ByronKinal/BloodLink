import React from 'react';
import StatusCard from '../../../shared/components/StatusCard';

export default function AppointmentEligibilityGate({ hasTriage, onGoToTriage }) {
  return (
    <StatusCard
      tone="warning"
      icon="alert-circle-outline"
      title={hasTriage ? 'Aún No Eres Apto' : 'Triage Pendiente'}
      message={
        hasTriage
          ? 'Tu última evaluación de Triage no te marca como apto para donar. Completa un nuevo Triage cuando cumplas los criterios para poder agendar una cita.'
          : 'Debes completar tu formulario de Triage médico y resultar apto antes de poder agendar una cita de donación.'
      }
      actionLabel="Ir a Triage"
      onAction={onGoToTriage}
    />
  );
}
