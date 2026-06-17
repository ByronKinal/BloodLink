import { AdminRewardsTable } from './AdminRewardsTable.jsx'
import { AdminRewardsToolbar } from './AdminRewardsToolbar.jsx'
import { AdminRewardCreateModal } from './AdminRewardCreateModal.jsx'
import { AdminRewardEditModal } from './AdminRewardEditModal.jsx'
import { useAdminRewardsSection } from '../hooks/useAdminRewardsSection.js'

export function AdminRewardsSection() {
  const {
    filteredRewards,
    loading,
    saving,
    error,
    search,
    setSearch,
    createModalOpen,
    setCreateModalOpen,
    editModalReward,
    setEditModalReward,
    deleteConfirmId,
    setDeleteConfirmId,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useAdminRewardsSection()

  return (
    <div className="space-y-5">
      <AdminRewardsToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateReward={() => setCreateModalOpen(true)}
      />

      {error ? (
        <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo mb-5">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[16px] border border-gris2 bg-white px-5 py-16 text-center text-[13px] text-txt3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          Cargando premios del catálogo...
        </div>
      ) : filteredRewards.length > 0 ? (
        <AdminRewardsTable
          rewards={filteredRewards}
          onEditReward={setEditModalReward}
          deleteConfirmId={deleteConfirmId}
          onRequestDelete={setDeleteConfirmId}
          onConfirmDelete={handleDelete}
          onCancelDelete={() => setDeleteConfirmId(null)}
          saving={saving}
        />
      ) : (
        <div className="rounded-[16px] border border-gris2 bg-white px-5 py-16 text-center text-[13px] text-txt3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          No se encontraron premios. Creá uno nuevo para comenzar.
        </div>
      )}

      <AdminRewardCreateModal
        open={createModalOpen}
        saving={saving}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      <AdminRewardEditModal
        open={Boolean(editModalReward)}
        reward={editModalReward}
        saving={saving}
        onClose={() => setEditModalReward(null)}
        onSave={handleUpdate}
      />
    </div>
  )
}
