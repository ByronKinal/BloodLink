import { TriageStatusBadge } from './TriageStatusBadge.jsx'

function formatDateTime(value) {
  if (!value) {
    return '—'
  }

  try {
    return new Intl.DateTimeFormat('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return '—'
  }
}

function getDonorLabel(form) {
  return form.donorEmail || `Donante ${form.accountId.slice(0, 8)}…`
}

function EvaluationBadge({ result }) {
  const isApto = result === 'APTO'
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
        isApto ? 'bg-[rgba(40,160,96,0.1)] text-verde-v' : 'bg-[rgba(212,32,64,0.08)] text-rojo'
      }`}
    >
      {result}
    </span>
  )
}

export function TriageList({ forms, onSelect }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gris2">
          <thead className="bg-[#FAFAF8]">
            <tr className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-txt3">
              <th className="px-5 py-3">Donante</th>
              <th className="px-5 py-3">Enviado</th>
              <th className="px-5 py-3">Evaluación</th>
              <th className="px-5 py-3">Revisión</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris2 bg-white">
            {forms.map((form) => (
              <tr key={form.id}>
                <td className="px-5 py-4 text-[13px] font-medium text-txt">{getDonorLabel(form)}</td>
                <td className="px-5 py-4 text-[12px] text-txt3">{formatDateTime(form.createdAt)}</td>
                <td className="px-5 py-4"><EvaluationBadge result={form.evaluation?.result} /></td>
                <td className="px-5 py-4"><TriageStatusBadge status={form.reviewStatus} /></td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onSelect(form.id)}
                    className="rounded-[10px] border border-gris2 bg-white px-3 py-2 text-[12px] font-medium text-txt transition-colors hover:border-rojo hover:text-rojo"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 lg:hidden sm:p-5">
        {forms.map((form) => (
          <article key={form.id} className="rounded-[16px] border border-gris2 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-txt">{getDonorLabel(form)}</p>
                <p className="text-[11px] text-txt3">{formatDateTime(form.createdAt)}</p>
              </div>
              <TriageStatusBadge status={form.reviewStatus} />
            </div>

            <div className="mt-3">
              <EvaluationBadge result={form.evaluation?.result} />
            </div>

            <button
              type="button"
              onClick={() => onSelect(form.id)}
              className="mt-4 w-full rounded-[10px] border border-gris2 bg-white px-3 py-2 text-[12px] font-medium text-txt transition-colors hover:border-rojo hover:text-rojo"
            >
              Ver detalle
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
