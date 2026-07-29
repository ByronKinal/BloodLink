const DATE_LABEL_OPTIONS = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

export function formatAppointmentDate(dateStr) {
  if (!dateStr) return 'Fecha por confirmar';
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('es-GT', DATE_LABEL_OPTIONS);
}

const STATUS_INFO = {
  PENDING: { label: 'Pendiente de Confirmación', color: '#D97706', bg: '#FEF3C7' },
  CONFIRMED: { label: 'Confirmada', color: '#16A34A', bg: '#D1FAE5' },
  CANCELLED: { label: 'Cancelada', color: '#DC2626', bg: '#FEE2E2' },
};

export function getAppointmentStatusInfo(status) {
  return STATUS_INFO[status] || STATUS_INFO.PENDING;
}

export function isAppointmentInPast(item) {
  if (!item?.date) return false;
  const scheduled = new Date(`${item.date}T${item.time || '23:59'}:00`);
  if (Number.isNaN(scheduled.getTime())) return false;
  return scheduled.getTime() < Date.now();
}
