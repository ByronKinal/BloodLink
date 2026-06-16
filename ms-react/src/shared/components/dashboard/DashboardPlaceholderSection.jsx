import { DashboardEmptyState } from './DashboardEmptyState.jsx'

export function DashboardPlaceholderSection({
  title,
  description,
  icon = '🚧',
}) {
  return (
    <div className="flex min-h-[360px] items-center justify-center text-center py-12">
      <DashboardEmptyState icon={icon} title={title} description={description} />
    </div>
  )
}