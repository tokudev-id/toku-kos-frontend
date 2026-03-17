import { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { roomService } from '@/api/room.service';
import type { RoomFormData } from '@/hooks/usePropertyDetails';
import { RoomFormFields } from '@/components/room/RoomFormFields';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyId: string;
}

const EMPTY_FORM: RoomFormData = {
  room_code: '',
  type: 'STANDARD',
  price_per_month: 1,
  price_per_year: 0,
  deposit: 0,
  floor: '',
  size: '',
  status: 'AVAILABLE',
  electricity_included: false,
  water_included: false,
  facilities: '',
  image_ids: [],
};

export function AddRoomModal({ isOpen, onClose, onSuccess, propertyId }: AddRoomModalProps) {
  const [formData, setFormData] = useState<RoomFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await roomService.createRoom({
        room_code: formData.room_code,
        type: formData.type,
        price_per_month: formData.price_per_month,
        price_per_year: formData.price_per_year || undefined,
        deposit: formData.deposit || undefined,
        floor: formData.floor || undefined,
        size: formData.size || undefined,
        status: formData.status,
        electricity_included: formData.electricity_included,
        water_included: formData.water_included,
        facilities: formData.facilities
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        image_ids: formData.image_ids,
        property_id: propertyId,
      });
      onSuccess();
      onClose();
      setFormData(EMPTY_FORM);
    } catch (error) {
      console.error('Failed to create room:', error);
      setSubmitError(error instanceof Error ? error.message : 'Gagal menambahkan kamar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Kamar Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{submitError}</div>
        )}
        <RoomFormFields values={formData} onChange={setFormData} />
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center h-11">
            Batal
          </button>
          <button type="submit" className="btn-primary flex-1 justify-center h-11" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Kamar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
