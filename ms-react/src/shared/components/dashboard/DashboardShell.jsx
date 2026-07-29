export function DashboardShell({
  sidebar,
  topbar,
  children,
  mainClassName = '',
  contentClassName = '',
}) {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden font-outfit bg-[#FAF8F5]">
      {sidebar}

      <div className={`flex-1 flex flex-col h-full min-w-0 overflow-hidden ${mainClassName}`}>
        {topbar}

        <main className={`flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-7 ${contentClassName}`}>
          {children}
        </main>
      </div>
    </div>
  )
}