import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { roomService } from '@/api/room.service';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyId: string;
}

export function AddRoomModal({ isOpen, onClose, onSuccess, propertyId }: AddRoomModalProps) {
  const [formData, setFormData] = useState({
    room_code: '',
    type: 'STANDARD' as 'STANDARD' | 'DELUXE' | 'SUITE',
    price_per_month: 0,
    status: 'AVAILABLE' as 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await roomService.createRoom({
        ...formData,
        property_id: propertyId,
      });
      onSuccess();
      onClose();
      setFormData({
        room_code: '',
        type: 'STANDARD',
        price_per_month: 0,
        status: 'AVAILABLE',
      });
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('Gagal menambahkan kamar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Kamar Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="input-label" htmlFor="room_code">Nomor Kamar</label>
          <input 
            id="room_code"
            type="text" 
            placeholder="A-101" 
            className="input-field"
            value={formData.room_code}
            onChange={(e) => setFormData({ ...formData, room_code: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="input-label" htmlFor="type">Tipe Kamar</label>
            <select 
              id="type"
              className="input-field"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="STANDARD">Standard</option>
              <option value="DELUXE">Deluxe</option>
              <option value="SUITE">Suite</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="input-label" htmlFor="status">Status Awal</label>
            <select 
              id="status"
              className="input-field"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="AVAILABLE">Tersedia</option>
              <option value="MAINTENANCE">Pemeliharaan</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="input-label" htmlFor="price">Harga per Bulan (Rp)</label>
          <input 
            id="price"
            type="number" 
            placeholder="1500000" 
            className="input-field"
            value={formData.price_per_month}
            onChange={(e) => setFormData({ ...formData, price_per_month: parseInt(e.target.value) || 0 })}
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center h-11">
            Batal
          </button>
          <button type="submit" className="btn-primary flex-1 justify-center h-11" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Kamar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
