import { useState } from 'react'
import { DashboardEmptyState } from '../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { Modal } from '../../../shared/components/Modal.jsx'
import { useStoreCatalog } from '../hooks/useStoreCatalog.js'

function RewardCard({ reward, walletPoints, onRedeemClick, redeeming }) {
  const requiredPoints = Number(reward.requiredPoints ?? 0)
  const available = reward.stock > 0
  const canRedeem = available && walletPoints >= requiredPoints
  const missingPoints = Math.max(requiredPoints - walletPoints, 0)

  return (
    <article className="group relative overflow-hidden rounded-[18px] border border-gris2 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_28px_rgba(184,28,50,0.10)] hover:border-[rgba(184,28,50,0.2)]">
      {/* Top accent bar */}
      <div
        className="h-[4px] w-full transition-all duration-300 group-hover:h-[5px]"
        style={{
          background: available
            ? 'linear-gradient(90deg, #28A060, #2EC47A)'
            : 'linear-gradient(90deg, #B81C32, #D42040)',
        }}
      />

      <div className="p-5">
        {/* Icon + status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[14px] bg-[rgba(184,28,50,0.06)] text-[22px] transition-transform duration-300 group-hover:scale-110 border border-gris2 group-hover:border-[rgba(184,28,50,0.15)]">
            {reward.imageUrl ? (
              <img
                src={reward.imageUrl}
                alt={reward.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B81C32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            )}
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${
              canRedeem
                ? 'bg-[rgba(40,160,96,0.1)] text-verde-v'
                : 'bg-[rgba(212,32,64,0.08)] text-rojo'
            }`}
          >
            {!available ? 'Agotado' : canRedeem ? 'Disponible' : 'Sin puntos'}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-[15px] font-semibold text-txt leading-snug mb-2">{reward.name}</h3>

        {/* Points */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(32,96,160,0.08)] px-3 py-1 text-[12px] font-semibold text-azul">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {requiredPoints} puntos
          </span>
        </div>

        {/* Stock bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] text-txt3 mb-1">
            <span>Stock</span>
            <span className="font-semibold">{reward.stock} unidades</span>
          </div>
          <div className="h-[5px] w-full rounded-full bg-gris2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (reward.stock / Math.max(reward.stock, 1)) * 100)}%`,
                background: canRedeem
                  ? 'linear-gradient(90deg, #28A060, #2EC47A)'
                  : '#B81C32',
              }}
            />
          </div>
          {available && !canRedeem ? (
            <p className="text-[11px] text-rojo mt-1">
              Te faltan {missingPoints} punto{missingPoints === 1 ? '' : 's'} para reclamarlo.
            </p>
          ) : null}
          {!available ? <p className="text-[11px] text-rojo mt-1">Este premio está agotado.</p> : null}
        </div>

        {/* CTA button */}
        <button
          type="button"
          disabled={!canRedeem || redeeming}
          onClick={() => onRedeemClick(reward)}
          className={`w-full rounded-[12px] px-4 py-3 text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            canRedeem && !redeeming
              ? 'border border-rojo bg-rojo text-white hover:bg-rojo-v hover:shadow-[0_4px_16px_rgba(184,28,50,0.25)] active:scale-[0.98]'
              : 'border border-gris2 bg-gris1 text-gris3 cursor-not-allowed'
          }`}
        >
          {redeeming ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : null}
          {!available ? 'Agotado' : canRedeem ? 'Reclamar' : 'Puntos insuficientes'}
        </button>
      </div>
    </article>
  )
}

export function StoreCatalog() {
  const { rewards, walletPoints, loading, error, redeemingId, handleRedeem } = useStoreCatalog()
  const [confirmReward, setConfirmReward] = useState(null)

  const handleConfirmRedeem = async () => {
    if (!confirmReward) {
      return
    }
    const costPoints = Number(confirmReward.requiredPoints)
    await handleRedeem(confirmReward.id, costPoints)
    setConfirmReward(null)
  }

  return (
    <div>
      <div className="mb-7 space-y-4">
        <div>
          <p className="text-[11px] font-bold text-rojo tracking-[0.12em] uppercase mb-1">Catálogo</p>
          <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">Tienda de premios</h2>
          <p className="text-[13px] text-txt3 font-light mt-1">Canjeá tus puntos por premios exclusivos de BloodLink.</p>
        </div>

        <div className="inline-flex min-w-[220px] items-center gap-3 rounded-[16px] border border-[rgba(184,28,50,0.15)] bg-white px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(184,28,50,0.08)] text-rojo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-txt3">Mis puntos</p>
            <p className="text-[18px] font-semibold text-txt">{walletPoints} puntos</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo mb-5">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[16px] border border-gris2 bg-white px-5 py-16 text-center text-[13px] text-txt3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          Cargando catálogo de premios...
        </div>
      ) : rewards.length > 0 ? (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              walletPoints={walletPoints}
              onRedeemClick={setConfirmReward}
              redeeming={redeemingId === reward.id}
            />
          ))}
        </div>
      ) : (
        <DashboardEmptyState
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B81C32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          }
          title="Sin premios disponibles"
          description="Aún no hay premios en el catálogo. Volvé pronto."
        />
      )}

      {/* Confirmation Modal */}
      <Modal
        open={Boolean(confirmReward)}
        title="Confirmar Canje"
        subtitle="Por favor confirma los detalles de tu canje"
        onClose={() => setConfirmReward(null)}
        maxWidth="max-w-[480px]"
        footer={
          <>
            <button
              type="button"
              onClick={() => setConfirmReward(null)}
              className="rounded-[10px] border border-gris2 bg-white px-4 py-2 text-[13px] font-medium text-txt hover:border-rojo hover:text-rojo transition-all duration-200"
              disabled={redeemingId === confirmReward?.id}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmRedeem}
              disabled={redeemingId === confirmReward?.id}
              className="rounded-[10px] border border-rojo bg-rojo px-4 py-2 text-[13px] font-semibold text-white hover:bg-rojo-v transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(184,28,50,0.2)]"
            >
              {redeemingId === confirmReward?.id ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : null}
              Confirmar Canje
            </button>
          </>
        }
      >
        {confirmReward && (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-[18px] border border-gris2 bg-[rgba(184,28,50,0.04)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              {confirmReward.imageUrl ? (
                <img
                  src={confirmReward.imageUrl}
                  alt={confirmReward.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B81C32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect x="2" y="7" width="20" height="5" />
                  <line x1="12" y1="22" x2="12" y2="7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              )}
            </div>
            <div>
              <h4 className="text-[16px] font-semibold text-txt">{confirmReward.name}</h4>
              <p className="text-[13px] text-txt3 mt-1">Costo: <span className="font-semibold text-azul">{confirmReward.requiredPoints} puntos</span></p>
            </div>
            <div className="rounded-[14px] bg-gris1 border border-gris2 p-4 text-[12px] text-txt3 space-y-2">
              <div className="flex justify-between">
                <span>Tus puntos actuales:</span>
                <span className="font-medium text-txt">{walletPoints} pts</span>
              </div>
              <div className="flex justify-between border-t border-gris2 pt-2 mt-2">
                <span>Saldo estimado después:</span>
                <span className="font-bold text-verde-v">{walletPoints - confirmReward.requiredPoints} pts</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
