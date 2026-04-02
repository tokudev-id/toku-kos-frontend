import { Modal } from '@/components/Modal';
import type { Property } from '@/api/property.service';
import type { PropertyEditFormValues } from '@/features/properties/hooks/usePropertiesPage';

interface EditPropertyModalProps {
  property: Property | null;
  form: PropertyEditFormValues;
  onClose: () => void;
  onChange: <K extends keyof PropertyEditFormValues>(
    field: K,
    value: PropertyEditFormValues[K]
  ) => void;
  onSubmit: (event: React.FormEvent) => void;
  isSaving: boolean;
}

export function EditPropertyModal({
  property,
  form,
  onClose,
  onChange,
  onSubmit,
  isSaving,
}: EditPropertyModalProps) {
  return (
    <Modal
      isOpen={!!property}
      onClose={onClose}
      title="Edit Properti"
      maxWidth="max-w-lg"
    >
      <form onSubmit={onSubmit} className="space-y-4 p-2">
        <div>
          <label className="label-field">Nama Properti *</label>
          <input
            required
            className="input-field"
            value={form.name}
            onChange={(event) => onChange('name', event.target.value)}
          />
        </div>
        <div>
          <label className="label-field">Alamat *</label>
          <input
            required
            className="input-field"
            value={form.address}
            onChange={(event) => onChange('address', event.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Kota</label>
            <input
              className="input-field"
              value={form.city}
              onChange={(event) => onChange('city', event.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Provinsi</label>
            <input
              className="input-field"
              value={form.province}
              onChange={(event) => onChange('province', event.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label-field">Deskripsi</label>
          <textarea
            rows={2}
            className="input-field"
            value={form.description}
            onChange={(event) => onChange('description', event.target.value)}
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1 justify-center"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex-1 justify-center"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
