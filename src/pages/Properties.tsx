import { Plus, Building2, Search, Trash2 } from 'lucide-react';
import { useProperties, PROPERTY_LIMIT } from '@/hooks/useProperties';
import { useDisclosure } from '@/hooks/useModalState';
import { AddPropertyModal, PropertyCard, PropertyFormFields } from '@/components/property';
import { Modal, Pagination } from '@/components/molecules';

export default function Properties() {
  const props = useProperties();
  const addModal = useDisclosure();

  return (
    <div className="space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Daftar Properti</h2>
          <p className="text-text-secondary">Kelola kos dan aset properti Anda.</p>
        </div>
        <button onClick={addModal.open} className="btn-primary">
          <Plus size={20} />
          Tambah Properti
        </button>
      </div>

      <div className="card p-md flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Cari nama atau alamat properti..."
            className="input-field pl-10 h-11"
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
          />
        </div>
      </div>

      {props.error && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {props.error}
        </div>
      )}

      {props.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card h-48 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : props.properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {props.properties.map((p) => (
              <PropertyCard key={p.id} property={p} onEdit={props.openEdit} onDelete={props.openDelete} />
            ))}
          </div>
          <Pagination page={props.page} total={props.total} limit={PROPERTY_LIMIT} onPageChange={props.setPage} />
        </>
      ) : (
        <div className="card py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-surface-bg rounded-full flex items-center justify-center text-text-secondary">
            <Building2 size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Belum Ada Properti</h3>
            <p className="text-text-secondary max-w-xs">Anda belum menambahkan kos atau properti apa pun. Mulai kelola kos pertama Anda sekarang.</p>
          </div>
          <button onClick={addModal.open} className="btn-primary">
            <Plus size={20} />
            Tambah Properti Pertama
          </button>
        </div>
      )}

      <AddPropertyModal isOpen={addModal.isOpen} onClose={addModal.close} onSuccess={props.fetchProperties} />

      <Modal isOpen={!!props.editingProperty} onClose={props.closeEdit} title="Edit Properti">
        <form onSubmit={props.handleUpdate} className="p-2 space-y-4">
          {props.editError && (
            <div className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{props.editError}</div>
          )}
          <PropertyFormFields values={props.editForm} onChange={props.setEditForm} />
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={props.closeEdit} className="btn-secondary flex-1 justify-center">Batal</button>
            <button type="submit" disabled={props.saving} className="btn-primary flex-1 justify-center">
              {props.saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!props.deletingProperty} onClose={props.closeDelete} title="Hapus Properti?" maxWidth="max-w-md">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger/10 text-danger rounded-full flex items-center justify-center"><Trash2 size={18} /></div>
          </div>
          <p className="text-text-secondary text-sm">
            Properti <strong>{props.deletingProperty?.name}</strong> akan dihapus permanen beserta semua data kamarnya. Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={props.closeDelete} className="btn-secondary flex-1 justify-center">Batal</button>
            <button onClick={props.handleDelete} disabled={props.deleting} className="btn-primary bg-danger hover:bg-danger/90 border-danger flex-1 justify-center">
              {props.deleting ? 'Menghapus...' : 'Ya, Hapus Properti'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
