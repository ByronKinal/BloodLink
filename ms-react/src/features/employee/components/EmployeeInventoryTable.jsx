function formatDate(value) {
  if (!value) {
    return '—'
  }

  try {
    return new Intl.DateTimeFormat('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return '—'
  }
}

function StatusBadge({ status }) {
  const normalized = String(status || '').toLowerCase()
  const isAvailable = normalized.includes('disponible')
  const isExpired = normalized.includes('caducado')

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
        isAvailable
          ? 'bg-[rgba(40,160,96,0.1)] text-verde-v'
          : isExpired
          ? 'bg-[rgba(212,32,64,0.08)] text-rojo'
          : 'bg-[rgba(32,96,160,0.08)] text-azul'
      }`}
    >
      {status || 'Sin estado'}
    </span>
  )
}

function DeleteConfirmButton({ bagId, deleteConfirmId, onRequestDelete, onConfirmDelete, onCancelDelete, saving }) {
  if (deleteConfirmId === bagId) {
    return (
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onConfirmDelete(bagId)}
          disabled={saving}
          className="rounded-[10px] border border-rojo bg-rojo px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-rojo-v disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Eliminando...' : 'Confirmar'}
        </button>
        <button
          type="button"
          onClick={onCancelDelete}
          className="rounded-[10px] border border-gris2 bg-white px-3 py-2 text-[12px] font-medium text-txt transition-colors hover:border-rojo hover:text-rojo"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onRequestDelete(bagId)}
      className="w-full rounded-[10px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-3 py-2 text-[12px] font-medium text-rojo transition-colors hover:border-rojo hover:bg-[rgba(212,32,64,0.1)]"
    >
      Eliminar
    </button>
  )
}

export function EmployeeInventoryTable({
  bags,
  onEditBag,
  deleteConfirmId,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
  saving,
}) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between border-b border-gris2 px-4 py-4 sm:px-5">
        <div>
          <p className="text-[13px] font-semibold text-txt">Bolsas en inventario</p>
        </div>
        <div className="hidden rounded-full bg-[rgba(32,96,160,0.08)] px-3 py-1 text-[11px] font-medium text-azul sm:inline-flex">
          {bags.length} bolsas
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gris2">
          <thead className="bg-[#FAFAF8]">
            <tr className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-txt3">
              <th className="px-5 py-3">Identificador</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Volumen</th>
              <th className="px-5 py-3">Donante</th>
              <th className="px-5 py-3">Extracción</th>
              <th className="px-5 py-3">Vencimiento</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris2 bg-white">
            {bags.map((bag) => (
              <tr key={bag.id} className="align-top transition-colors hover:bg-[rgba(32,96,160,0.04)]">
                <td className="px-5 py-4 text-[13px] font-semibold text-txt">{bag.bagIdentifier}</td>
                <td className="px-5 py-4 text-[12px] text-txt3">{bag.bloodType}</td>
                <td className="px-5 py-4 text-[12px] text-txt3">{bag.volumeMl} ml</td>
                <td className="px-5 py-4 text-[12px] text-txt3">{bag.donorUserId || 'N/A'}</td>
                <td className="px-5 py-4 text-[12px] text-txt3">{formatDate(bag.extractionDate)}</td>
                <td className="px-5 py-4 text-[12px] text-txt3">{formatDate(bag.expirationDate)}</td>
                <td className="px-5 py-4"><StatusBadge status={bag.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEditBag(bag)}
                      className="rounded-[10px] border border-rojo bg-rojo px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-rojo-v"
                    >
                      Editar
                    </button>
                    <DeleteConfirmButton
                      bagId={bag.id}
                      deleteConfirmId={deleteConfirmId}
                      onRequestDelete={onRequestDelete}
                      onConfirmDelete={onConfirmDelete}
                      onCancelDelete={onCancelDelete}
                      saving={saving}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 lg:hidden sm:p-5">
        {bags.map((bag) => (
          <article key={bag.id} className="rounded-[16px] border border-gris2 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-txt">{bag.bagIdentifier}</p>
                    <p className="text-[11px] text-txt3 mt-0.5">{bag.bloodType} · {bag.volumeMl} ml</p>
                  </div>
                  <StatusBadge status={bag.status} />
                </div>

                <div className="mt-3 grid gap-2 text-[12px] text-txt3">
                  <p>Donante: {bag.donorUserId || 'N/A'}</p>
                  <p>Extracción: {formatDate(bag.extractionDate)}</p>
                  <p>Vencimiento: {formatDate(bag.expirationDate)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEditBag(bag)}
                className="flex-1 rounded-[10px] border border-rojo bg-rojo px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-rojo-v"
              >
                Editar
              </button>
              <div className="flex-1">
                <DeleteConfirmButton
                  bagId={bag.id}
                  deleteConfirmId={deleteConfirmId}
                  onRequestDelete={onRequestDelete}
                  onConfirmDelete={onConfirmDelete}
                  onCancelDelete={onCancelDelete}
                  saving={saving}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
