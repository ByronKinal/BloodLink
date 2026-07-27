const FRESHNESS_DAYS = 7
const DAY_IN_MS = 24 * 60 * 60 * 1000

export function getTriageFreshnessInfo(lastForm, now = new Date()) {
  if (!lastForm?.createdAt) {
    return { eligible: false, daysSinceSubmission: null, lastForm: null }
  }

  const elapsedMs = now.getTime() - new Date(lastForm.createdAt).getTime()
  const daysSinceSubmission = Math.floor(elapsedMs / DAY_IN_MS)

  return {
    eligible: daysSinceSubmission < FRESHNESS_DAYS,
    daysSinceSubmission,
    lastForm,
  }
}
