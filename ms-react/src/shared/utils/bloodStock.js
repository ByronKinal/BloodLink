export const CRITICAL_STOCK_THRESHOLD_BAGS = 5

export function getCriticalBloodTypes(byBloodType = {}) {
  return Object.entries(byBloodType)
    .filter(([, summary]) => (summary?.disponibleBags ?? 0) <= CRITICAL_STOCK_THRESHOLD_BAGS)
    .map(([bloodType, summary]) => ({
      bloodType,
      disponibleBags: summary?.disponibleBags ?? 0,
    }))
    .sort((a, b) => a.disponibleBags - b.disponibleBags)
}
