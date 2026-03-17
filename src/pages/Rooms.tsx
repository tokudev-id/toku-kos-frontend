import { useState } from 'react';
import { useRoomsPage } from '@/hooks/useRoomsPage';
import { roomService } from '@/api/room.service';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { Modal } from '@/components/molecules/Modal';
import { RoomList } from '@/components/room/RoomList';
import { AddRoomModal } from '@/components/room/AddRoomModal';
import { Plus } from 'lucide-react';

export default function Rooms() {
  const {
    selectedPropertyId,
    setSelectedPropertyId,
    properties,
    isLoadingProperties,
    addModal,
    deletingRoom,
    deleteModal,
    handleDeleteRoom,
  } = useRoomsPage();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleAddSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const confirmDelete = async () => {
    if (!deletingRoom) return;

    setIsDeleting(true);
    setDeleteError('');

    try {
      await roomService.deleteRoom(deletingRoom.id);
      deleteModal.close();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Gagal menghapus kamar.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-lg">
      <SectionHeader
        title="Manajemen Kamar"
        subtitle="Kelola semua kamar di seluruh properti Anda"
        action={
          selectedPropertyId
            ? { icon: <Plus size={20} /> ,label: 'Tambah Kamar', onClick: addModal.open }
            : undefined
        }
      />

      <div className="card p-md flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-64">
          <label className="input-label">Filter Properti</label>
          <select
            className="input-field"
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            disabled={isLoadingProperties}
          >
            <option value="">Semua Properti</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <RoomList
        key={refreshKey}
        propertyId={selectedPropertyId}
        onDeleteRoom={handleDeleteRoom}
      />

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        onSuccess={handleAddSuccess}
        propertyId={selectedPropertyId}
      />

      {/* Delete Confirmation Modal */}
      {deletingRoom && (
        <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Hapus Kamar">
          <div className="space-y-4">
            {deleteError && (
              <div className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">
                {deleteError}
              </div>
            )}
            <p className="text-text-secondary">
              Apakah Anda yakin ingin menghapus kamar <strong>{deletingRoom.room_code}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={deleteModal.close}
                className="btn-secondary flex-1 justify-center h-11"
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn-primary flex-1 justify-center h-11 bg-danger hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
