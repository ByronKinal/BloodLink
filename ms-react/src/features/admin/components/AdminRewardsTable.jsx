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

function StockBadge({ stock }) {
  const available = stock > 0

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
        available
          ? 'bg-[rgba(40,160,96,0.1)] text-verde-v'
          : 'bg-[rgba(212,32,64,0.08)] text-rojo'
      }`}
    >
      {available ? `${stock} disp.` : 'Agotado'}
    </span>
  )
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
        status
          ? 'bg-[rgba(40,160,96,0.1)] text-verde-v'
          : 'bg-[rgba(200,148,42,0.1)] text-oro'
      }`}
    >
      {status ? 'Activo' : 'Inactivo'}
    </span>
  )
}

function DeleteConfirmButton({ rewardId, deleteConfirmId, onRequestDelete, onConfirmDelete, onCancelDelete, saving }) {
  if (deleteConfirmId === rewardId) {
    return (
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onConfirmDelete(rewardId)}
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
      onClick={() => onRequestDelete(rewardId)}
      className="w-full rounded-[10px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-3 py-2 text-[12px] font-medium text-rojo transition-colors hover:border-rojo hover:bg-[rgba(212,32,64,0.1)]"
    >
      Eliminar
    </button>
  )
}

export function AdminRewardsTable({
  rewards,
  onEditReward,
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
          <p className="text-[13px] font-semibold text-txt">Premios del sistema</p>
        </div>
        <div className="hidden rounded-full bg-[rgba(184,28,50,0.08)] px-3 py-1 text-[11px] font-medium text-rojo sm:inline-flex">
          {rewards.length} premios
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gris2">
          <thead className="bg-[#FAFAF8]">
            <tr className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-txt3">
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Puntos req.</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Creado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gris2 bg-white">
            {rewards.map((reward) => (
              <tr key={reward.id} className="align-top transition-colors hover:bg-[rgba(184,28,50,0.02)]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[rgba(184,28,50,0.06)] border border-gris2">
                      {reward.imageUrl ? (
                        <img src={reward.imageUrl} alt={reward.name} className="h-full w-full object-cover" />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B81C32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 12 20 22 4 22 4 12" />
                          <rect x="2" y="7" width="20" height="5" />
                          <line x1="12" y1="22" x2="12" y2="7" />
                          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-[13px] font-semibold text-txt">{reward.name}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[rgba(32,96,160,0.08)] px-3 py-1 text-[11px] font-semibold text-azul">
                    {reward.requiredPoints} pts
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StockBadge stock={reward.stock} />
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={reward.status} />
                </td>
                <td className="px-5 py-4 text-[12px] text-txt3">{formatDate(reward.createdAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEditReward(reward)}
                      className="rounded-[10px] border border-rojo bg-rojo px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-rojo-v"
                    >
                      Editar
                    </button>
                    <DeleteConfirmButton
                      rewardId={reward.id}
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

      {/* Mobile cards */}
      <div className="grid gap-3 p-4 lg:hidden sm:p-5">
        {rewards.map((reward) => (
          <article key={reward.id} className="rounded-[16px] border border-gris2 bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[rgba(184,28,50,0.06)] border border-gris2">
                {reward.imageUrl ? (
                  <img src={reward.imageUrl} alt={reward.name} className="h-full w-full object-cover" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B81C32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-txt">{reward.name}</p>
                    <p className="text-[11px] text-txt3 mt-0.5">{reward.requiredPoints} puntos requeridos</p>
                  </div>
                  <StatusBadge status={reward.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StockBadge stock={reward.stock} />
                  <span className="text-[11px] text-txt3">{formatDate(reward.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEditReward(reward)}
                className="flex-1 rounded-[10px] border border-rojo bg-rojo px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-rojo-v"
              >
                Editar
              </button>
              <div className="flex-1">
                <DeleteConfirmButton
                  rewardId={reward.id}
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
