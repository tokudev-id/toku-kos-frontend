import { Modal } from '@/components/molecules';
import type { Resident } from '@/api/resident.service';

interface EditResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
  onUpdate: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
}

export function EditResidentModal({
  isOpen,
  onClose,
  resident,
  onUpdate,
  saving,
}: EditResidentModalProps) {
  if (!resident) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Data Penghuni"
    >
      <form onSubmit={onUpdate} className="space-y-4">
        <div>
          <label className="label-field">Nama Lengkap *</label>
          <input name="full_name" required className="input-field" defaultValue={resident.full_name} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Email *</label>
            <input name="email" required type="email" className="input-field" defaultValue={resident.email} />
          </div>
          <div>
            <label className="label-field">Telepon</label>
            <input name="phone" className="input-field" defaultValue={resident.phone} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">No. KTP/Identitas</label>
            <input name="identity_number" className="input-field" defaultValue={resident.identity_number} />
          </div>
          <div>
            <label className="label-field">Kontak Darurat</label>
            <input name="emergency_contact" className="input-field" defaultValue={resident.emergency_contact} />
          </div>
        </div>
        <div>
          <label className="label-field">Catatan</label>
          <textarea name="notes" rows={2} className="input-field" defaultValue={resident.notes} />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
