export function DashboardShell({
  sidebar,
  topbar,
  children,
  mainClassName = '',
  contentClassName = '',
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden font-outfit">
      {sidebar}

      <div className={`flex-1 flex flex-col overflow-hidden ${mainClassName}`}>
        {topbar}

        <main className={`flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-7 ${contentClassName}`}>
          {children}
        </main>
      </div>
    </div>
  )
}