import { Plus } from 'lucide-react';
import { useResidents } from '@/hooks/useResidents';
import {
  AddResidentModal,
  ResidentFilters,
  ResidentTable,
  ResidentGrid
} from '@/components/resident';
import { Pagination, SectionHeader } from '@/components/molecules';
import { 
  EditResidentModal, 
  CheckoutResidentModal, 
  KtpModal,
  AssignRoomModal
} from './Components';

export default function Residents() {
  const {
    residents, total, page, setPage, search, setSearch,
    viewMode, setViewMode, isLoading, fetchResidents,
    addModal, editingResident, setEditingResident,
    checkoutResident, setCheckoutResident,
    ktpResident, setKtpResident,
    ktpViewMode, setKtpViewMode,
    assignRoomResident, setAssignRoomResident,
    saving, ktpFile, setKtpFile, ktpUploading,
    handleUpdate, onCheckoutConfirm, onKtpUpload
  } = useResidents();

  return (
    <div className="space-y-lg">
      <SectionHeader
        title="Daftar Penghuni"
        subtitle="Kelola data penyewa kos Anda secara terpusat."
        action={{
          label: "Tambah Penghuni",
          icon: <Plus size={20} />,
          onClick: addModal.open
        }}
      />

      <ResidentFilters
        search={search}
        onSearchChange={setSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'table' ? (
        <ResidentTable
          items={residents}
          isLoading={isLoading}
          onEdit={setEditingResident}
          onCheckout={setCheckoutResident}
          onViewKtp={(r) => { setKtpResident(r); setKtpViewMode('view'); }}
          onUploadKtp={(r) => { setKtpResident(r); setKtpViewMode('upload'); }}
          onAssignRoom={setAssignRoomResident}
        />
      ) : (
        <ResidentGrid
          items={residents}
          isLoading={isLoading}
          onEdit={setEditingResident}
          onCheckout={setCheckoutResident}
          onViewKtp={(r) => { setKtpResident(r); setKtpViewMode('view'); }}
          onUploadKtp={(r) => { setKtpResident(r); setKtpViewMode('upload'); }}
          onAssignRoom={setAssignRoomResident}
        />
      )}

      <Pagination page={page} total={total} limit={10} onPageChange={setPage} />

      <AddResidentModal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        onSuccess={fetchResidents}
      />

      <EditResidentModal
        isOpen={!!editingResident}
        onClose={() => setEditingResident(null)}
        resident={editingResident}
        onUpdate={handleUpdate}
        saving={saving}
      />

      <CheckoutResidentModal
        isOpen={!!checkoutResident}
        onClose={() => setCheckoutResident(null)}
        resident={checkoutResident}
        onConfirm={onCheckoutConfirm}
        saving={saving}
      />

      <KtpModal
        isOpen={!!ktpResident}
        onClose={() => { setKtpResident(null); setKtpFile(null); }}
        resident={ktpResident}
        viewMode={ktpViewMode}
        onKtpFileChange={setKtpFile}
        ktpFile={ktpFile}
        onUpload={onKtpUpload}
        uploading={ktpUploading}
      />

      <AssignRoomModal
        isOpen={!!assignRoomResident}
        onClose={() => setAssignRoomResident(null)}
        resident={assignRoomResident}
        onSuccess={fetchResidents}
      />
    </div>
  );
}
