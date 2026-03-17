import type { Room } from '@/api/room.service';
import type { RoomFormData } from '@/hooks/usePropertyDetails';
import { MediaPicker } from '@/components/media/MediaPicker';

interface RoomFormFieldsProps {
  values: RoomFormData;
  onChange: (values: RoomFormData) => void;
}

export function RoomFormFields({ values, onChange }: RoomFormFieldsProps) {
  const set =
    <K extends keyof RoomFormData>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      onChange({ ...values, [key]: e.target.value });
    };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="input-label">No. Kamar *</label>
          <input required className="input-field" placeholder="A-101" value={values.room_code} onChange={set('room_code')} />
        </div>
        <div>
          <label className="input-label">Tipe</label>
          <select className="input-field" value={values.type} onChange={(e) => onChange({ ...values, type: e.target.value as Room['type'] })}>
            <option value="STANDARD">Standard</option>
            <option value="DELUXE">Deluxe</option>
            <option value="SUITE">Suite</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="input-label">Harga/Bulan (Rp) *</label>
          <input
            required
            type="number"
            min={1}
            className="input-field"
            value={values.price_per_month}
            onChange={(e) => onChange({ ...values, price_per_month: Number(e.target.value) || 1 })}
          />
        </div>
        <div>
          <label className="input-label">Harga/Tahun (Rp)</label>
          <input
            type="number"
            min={0}
            className="input-field"
            value={values.price_per_year}
            onChange={(e) => onChange({ ...values, price_per_year: Number(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="input-label">Deposit (Rp)</label>
          <input
            type="number"
            min={0}
            className="input-field"
            value={values.deposit}
            onChange={(e) => onChange({ ...values, deposit: Number(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="input-label">Lantai</label>
          <input className="input-field" placeholder="2" value={values.floor} onChange={set('floor')} />
        </div>
        <div>
          <label className="input-label">Ukuran (m²)</label>
          <input className="input-field" placeholder="3x4" value={values.size} onChange={set('size')} />
        </div>
      </div>

      <div>
        <label className="input-label">Status</label>
        <select className="input-field" value={values.status} onChange={(e) => onChange({ ...values, status: e.target.value as Room['status'] })}>
          <option value="AVAILABLE">Tersedia</option>
          <option value="OCCUPIED">Terisi</option>
          <option value="MAINTENANCE">Pemeliharaan</option>
        </select>
      </div>

      <div className="space-y-2">
        <p className="input-label">Utilitas</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={values.electricity_included}
              onChange={(e) => onChange({ ...values, electricity_included: e.target.checked })}
            />
            Listrik termasuk
          </label>
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={values.water_included}
              onChange={(e) => onChange({ ...values, water_included: e.target.checked })}
            />
            Air termasuk
          </label>
        </div>
      </div>

      <div>
        <label className="input-label">Foto Kamar</label>
        <MediaPicker
          type="ROOM_PHOTO"
          selectedIds={values.image_ids}
          onChange={(ids) => onChange({ ...values, image_ids: ids })}
          maxFiles={10}
        />
      </div>

      <div>
        <label className="input-label">Fasilitas (Pisahkan dengan koma)</label>
        <input
          className="input-field"
          placeholder="AC, WiFi, Kamar mandi dalam"
          value={values.facilities}
          onChange={set('facilities')}
        />
      </div>
    </>
  );
}
