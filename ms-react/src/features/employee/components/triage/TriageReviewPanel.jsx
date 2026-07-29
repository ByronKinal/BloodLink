import { DashboardSectionCard } from '../../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { DashboardEmptyState } from '../../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { Toast } from '../../../../shared/components/Toast.jsx'
import { useTriageReview } from '../../hooks/useTriageReview.js'
import { TriageList } from './TriageList.jsx'
import { TriageListSkeleton } from './TriageListSkeleton.jsx'
import { TriageDetailModal } from './TriageDetailModal.jsx'

export function TriageReviewPanel() {
  const {
    forms,
    loading,
    error,
    reviewingId,
    selectedForm,
    openDetail,
    closeDetail,
    reviewTriage,
    toast,
    dismissToast,
  } = useTriageReview()

  return (
    <div>
      <div className="mb-7">
        <p className="text-[11px] font-bold text-rojo tracking-[0.12em] uppercase mb-1">Revisión médica</p>
        <h2 className="font-cormorant text-[32px] font-medium text-txt leading-none">Triajes de donantes</h2>
        <p className="text-[13px] text-txt3 font-light mt-1">
          Revisá los formularios enviados y aprobá o rechazá el paso a camilla.
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      {loading ? (
        <TriageListSkeleton />
      ) : forms.length > 0 ? (
        <DashboardSectionCard
          title="Formularios recibidos"
          subtitle={`${forms.length} formulario${forms.length === 1 ? '' : 's'} en total`}
          cardClassName="bg-transparent border-none shadow-none p-0"
        >
          <TriageList forms={forms} onSelect={openDetail} />
        </DashboardSectionCard>
      ) : (
        <div className="rounded-[16px] border border-gris2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <DashboardEmptyState
            icon="🩺"
            title="Sin formularios pendientes"
            description="Cuando un donante envíe su triaje médico, aparecerá aquí."
            className="py-12"
          />
        </div>
      )}

      <TriageDetailModal
        form={selectedForm}
        reviewing={Boolean(reviewingId)}
        onClose={closeDetail}
        onReview={reviewTriage}
      />

      <Toast message={toast?.message} tone={toast?.tone} onDismiss={dismissToast} />
    </div>
  )
}
