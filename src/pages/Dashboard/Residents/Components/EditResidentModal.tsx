import { Modal } from '@/components/molecules';
import type { Resident } from '@/api/resident.service';

interface EditResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
  onUpdate: (e: React.FormEvent) => Promise<void>;
  saving: boolean;
  error?: string | null;
}

export function EditResidentModal({
  isOpen,
  onClose,
  resident,
  onUpdate,
  saving,
  error,
}: EditResidentModalProps) {
  if (!resident) return null;

  const residentName = resident.profile?.full_name || resident.full_name || '-';
  const residentEmail = resident.profile?.email || resident.email || '-';
  const residentPhone = resident.profile?.phone_number || resident.phone || '-';
  const residentIdentity = resident.identity_number || '-';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Data Penghuni"
    >
      <form onSubmit={onUpdate} className="space-y-4">
        <div className="rounded-xl border border-border-default bg-surface-bg/50 p-4 space-y-2 text-sm">
          <p className="text-text-secondary">
            Data yang dapat diperbarui dari halaman ini: <span className="font-semibold text-text-primary">Kontak Darurat</span> dan <span className="font-semibold text-text-primary">Catatan</span>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-text-secondary">
            <p><span className="font-semibold text-text-primary">Nama:</span> {residentName}</p>
            <p><span className="font-semibold text-text-primary">Email:</span> {residentEmail}</p>
            <p><span className="font-semibold text-text-primary">Telepon:</span> {residentPhone}</p>
            <p><span className="font-semibold text-text-primary">No. Identitas:</span> {residentIdentity}</p>
          </div>
        </div>
        <div>
          <label className="label-field">Kontak Darurat</label>
          <input name="emergency_contact" className="input-field" defaultValue={resident.emergency_contact} />
        </div>
        <div>
          <label className="label-field">Catatan</label>
          <textarea name="notes" rows={2} className="input-field" defaultValue={resident.notes} />
        </div>
        {error && (
          <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}
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
