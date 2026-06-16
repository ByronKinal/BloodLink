import { useEffect } from 'react'

export function Modal({
  open,
  title,
  subtitle,
  children,
  onClose,
  maxWidth = 'max-w-[720px]',
  contentClassName = '',
  footer,
}) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,16,24,0.72)] px-4 py-4 backdrop-blur-[2px]">
      <div className={`w-full ${maxWidth} rounded-[18px] border border-gris2 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.26)]`}>
        <div className="flex items-start justify-between gap-4 border-b border-gris2 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[18px] font-semibold text-txt">{title}</h2>
            {subtitle ? <p className="mt-1 text-[12px] text-txt3">{subtitle}</p> : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-none bg-[rgba(17,16,24,0.06)] px-3 py-2 text-[12px] font-medium text-txt3 transition-colors hover:bg-[rgba(17,16,24,0.12)]"
          >
            Cerrar
          </button>
        </div>

        <div className={`max-h-[calc(100vh-140px)] overflow-y-auto px-5 py-5 sm:px-6 ${contentClassName}`.trim()}>
          {children}
        </div>

        {footer ? (
          <div className="flex flex-col gap-3 border-t border-gris2 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}