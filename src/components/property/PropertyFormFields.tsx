import type { PropertyFormData } from '@/hooks/useProperties';

interface PropertyFormFieldsProps {
  values: PropertyFormData;
  onChange: (values: PropertyFormData) => void;
}

export function PropertyFormFields({ values, onChange }: PropertyFormFieldsProps) {
  const set = (key: keyof PropertyFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onChange({ ...values, [key]: e.target.value });

  return (
    <>
      <div>
        <label className="input-label">Nama Properti *</label>
        <input required className="input-field" value={values.name} onChange={set('name')} />
      </div>
      <div>
        <label className="input-label">Alamat *</label>
        <textarea rows={3} required className="input-field" value={values.address} onChange={set('address')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="input-label">Kota</label>
          <input className="input-field" placeholder="Contoh: Jakarta" value={values.city} onChange={set('city')} />
        </div>
        <div>
          <label className="input-label">Provinsi</label>
          <input className="input-field" placeholder="Contoh: DKI Jakarta" value={values.province} onChange={set('province')} />
        </div>
      </div>
      <div>
        <label className="input-label">Kode Pos</label>
        <input className="input-field" placeholder="Contoh: 10110" value={values.zip_code} onChange={set('zip_code')} />
      </div>
      <div>
        <label className="input-label">Deskripsi</label>
        <textarea rows={2} className="input-field" placeholder="Info tambahan mengenai kos ini..." value={values.description} onChange={set('description')} />
      </div>
      <div>
        <label className="input-label">Catatan Internal</label>
        <textarea rows={2} className="input-field" placeholder="Catatan khusus untuk pengelolaan internal..." value={values.notes} onChange={set('notes')} />
      </div>
    </>
  );
}
