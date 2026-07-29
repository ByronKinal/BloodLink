const LOCK_HOURS = 24
const HOUR_IN_MS = 60 * 60 * 1000

export function getLatestTriageForm(forms = []) {
  return [...forms].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0] ?? null
}

export function getTriageLockInfo(lastForm, now = new Date()) {
  if (!lastForm?.createdAt) {
    return { blocked: false, hoursRemaining: 0, lastForm: null }
  }

  const elapsedMs = now.getTime() - new Date(lastForm.createdAt).getTime()
  const remainingMs = LOCK_HOURS * HOUR_IN_MS - elapsedMs

  if (remainingMs <= 0) {
    return { blocked: false, hoursRemaining: 0, lastForm }
  }

  return {
    blocked: true,
    hoursRemaining: Math.ceil(remainingMs / HOUR_IN_MS),
    lastForm,
  }
}
