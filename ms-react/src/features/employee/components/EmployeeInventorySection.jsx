import { DashboardEmptyState } from '../../../shared/components/dashboard/DashboardEmptyState.jsx'
import { DashboardSectionCard } from '../../../shared/components/dashboard/DashboardSectionCard.jsx'
import { EmployeeInventoryTable } from './EmployeeInventoryTable.jsx'
import { EmployeeInventoryToolbar } from './EmployeeInventoryToolbar.jsx'
import { EmployeeInventoryCreateModal } from './EmployeeInventoryCreateModal.jsx'
import { EmployeeInventoryEditModal } from './EmployeeInventoryEditModal.jsx'
import { useEmployeeInventorySection } from '../hooks/useEmployeeInventorySection.js'

export function EmployeeInventorySection() {
  const {
    filteredBags,
    loading,
    saving,
    error,
    search,
    setSearch,
    createModalOpen,
    setCreateModalOpen,
    editModalBag,
    setEditModalBag,
    deleteConfirmId,
    setDeleteConfirmId,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useEmployeeInventorySection()

  return (
    <div className="space-y-5">
      <EmployeeInventoryToolbar
        search={search}
        onSearchChange={setSearch}
        onCreate={() => setCreateModalOpen(true)}
      />

      {error ? (
        <div className="rounded-[14px] border border-[rgba(212,32,64,0.2)] bg-[rgba(212,32,64,0.06)] px-4 py-3 text-[13px] text-rojo">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[16px] border border-gris2 bg-white px-5 py-16 text-center text-[13px] text-txt3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          Cargando inventario...
        </div>
      ) : filteredBags.length > 0 ? (
        <EmployeeInventoryTable
          bags={filteredBags}
          onEditBag={setEditModalBag}
          deleteConfirmId={deleteConfirmId}
          onRequestDelete={setDeleteConfirmId}
          onConfirmDelete={handleDelete}
          onCancelDelete={() => setDeleteConfirmId(null)}
          saving={saving}
        />
      ) : (
        <DashboardEmptyState
          icon="🧪"
          title="No hay bolsas en inventario"
          description="Agrega la primera bolsa de sangre para comenzar a gestionar el inventario."
          onClick={() => setCreateModalOpen(true)}
        />
      )}

      <EmployeeInventoryCreateModal
        open={createModalOpen}
        saving={saving}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      <EmployeeInventoryEditModal
        open={Boolean(editModalBag)}
        bag={editModalBag}
        saving={saving}
        onClose={() => setEditModalBag(null)}
        onSave={handleUpdate}
      />
    </div>
  )
}
