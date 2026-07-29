export function formatBoolean(value) {
  return value ? 'Sí' : 'No'
}

export function formatDate(value) {
  if (!value) {
    return '—'
  }

  try {
    return new Intl.DateTimeFormat('es-GT', { day: '2-digit', month: 'short', year: 'numeric' }).format(
      new Date(value)
    )
  } catch {
    return '—'
  }
}
