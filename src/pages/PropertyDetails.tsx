import { useParams, Link } from 'react-router-dom';
import {
  Plus,
  ChevronLeft,
  LayoutGrid,
  Users,
  CircleDot,
  Pencil,
  Trash2,
} from 'lucide-react';
import { usePropertyDetails } from '@/hooks/usePropertyDetails';
import { useDisclosure } from '@/hooks/useModalState';
import { AddRoomModal, RoomList, RoomFormFields } from '@/components/room';
import { Modal } from '@/components/molecules';
import { PropertyFormFields } from '@/components/property';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const details = usePropertyDetails(id!);
  const addRoomModal = useDisclosure();

  if (details.isLoading) return <div className="p-xl animate-pulse text-text-secondary italic">Memuat Detail Properti...</div>;
  if (!details.property) return <div className="p-xl text-danger">Properti tidak ditemukan.</div>;

  return (
    <div className="space-y-lg">
      <div className="flex flex-col gap-4">
        <Link to="/properties" className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand-primary transition-colors w-fit">
          <ChevronLeft size={16} />
          Kembali ke Daftar Properti
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{details.property.name}</h2>
            <p className="text-text-secondary">{details.property.address}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={details.openEditProperty} className="btn-secondary flex items-center gap-2">
              <Pencil size={16} /> Edit Info
            </button>
            <button onClick={addRoomModal.open} className="btn-primary">
              <Plus size={20} />
              Tambah Kamar
            </button>
          </div>
        </div>
      </div>

      {details.error && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {details.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <div className="card p-md flex items-center gap-4">
          <div className="p-2 bg-brand-primary-soft text-brand-primary rounded-lg"><LayoutGrid size={20} /></div>
          <div>
            <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">Total Kamar</p>
            <p className="text-lg font-bold">{details.property.total_rooms || 0}</p>
          </div>
        </div>
        <div className="card p-md flex items-center gap-4">
          <div className="p-2 bg-success/10 text-success rounded-lg"><CircleDot size={20} /></div>
          <div>
            <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">Tersedia</p>
            <p className="text-lg font-bold text-success">{details.property.available_rooms || 0}</p>
          </div>
        </div>
        <div className="card p-md flex items-center gap-4">
          <div className="p-2 bg-warning/10 text-warning rounded-lg"><Users size={20} /></div>
          <div>
            <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">Terisi</p>
            <p className="text-lg font-bold text-warning">
              {Math.max((details.property.total_rooms || 0) - (details.property.available_rooms || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      <RoomList
        key={`${id}-${details.roomListVersion}`}
        propertyId={id!}
        onAddRoom={addRoomModal.open}
        onEditRoom={details.openEditRoom}
        onDeleteRoom={details.setDeletingRoom}
      />

      <AddRoomModal
        isOpen={addRoomModal.isOpen}
        onClose={addRoomModal.close}
        onSuccess={details.refetch}
        propertyId={id!}
      />

      <Modal isOpen={details.editingProperty} onClose={details.closeEditProperty} title="Edit Info Properti" maxWidth="max-w-3xl">
        <form onSubmit={details.handleUpdateProperty} className="space-y-4">
          {details.propError && (
            <div className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{details.propError}</div>
          )}
          <PropertyFormFields values={details.propForm} onChange={details.setPropForm} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={details.closeEditProperty} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={details.savingProp} className="btn-primary flex-1">
              {details.savingProp ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!details.editingRoom}
        onClose={() => details.setEditingRoom(null)}
        title={`Edit Kamar ${details.editingRoom?.room_code ?? ''}`}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={details.handleUpdateRoom} className="space-y-4">
          {details.roomError && (
            <div className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{details.roomError}</div>
          )}
          <RoomFormFields values={details.roomForm} onChange={details.setRoomForm} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => details.setEditingRoom(null)} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={details.savingRoom} className="btn-primary flex-1">
              {details.savingRoom ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!details.deletingRoom}
        onClose={() => details.setDeletingRoom(null)}
        title="Hapus Kamar?"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger/10 text-danger rounded-full flex items-center justify-center"><Trash2 size={18} /></div>
            <p className="text-text-secondary text-sm">
              Kamar <strong>{details.deletingRoom?.room_code}</strong> akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => details.setDeletingRoom(null)} className="btn-secondary flex-1">Batal</button>
            <button onClick={details.handleDeleteRoom} disabled={details.deletingRoomId} className="flex-1 px-4 py-2 bg-danger text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
              {details.deletingRoomId ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
