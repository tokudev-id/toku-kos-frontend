import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { residentService } from '@/api/resident.service';

interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddResidentModal({ isOpen, onClose, onSuccess }: AddResidentModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    identity_number: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await residentService.createResident(formData);
      onSuccess();
      onClose();
      setFormData({ full_name: '', email: '', phone: '', identity_number: '' });
    } catch (error) {
      console.error('Failed to create resident:', error);
      alert('Gagal menambahkan penghuni.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Penghuni Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="input-label" htmlFor="full_name">Nama Lengkap</label>
          <input 
            id="full_name"
            type="text" 
            placeholder="Budi Budiman" 
            className="input-field"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="input-label" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="budi@email.com" 
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="input-label" htmlFor="phone">Nomor Telepon/WA</label>
            <input 
              id="phone"
              type="tel" 
              placeholder="0812..." 
              className="input-field"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="input-label" htmlFor="id_number">Nomor Identitas (KTP/Passport)</label>
          <input 
            id="id_number"
            type="text" 
            placeholder="317..." 
            className="input-field"
            value={formData.identity_number}
            onChange={(e) => setFormData({ ...formData, identity_number: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center h-11">
            Batal
          </button>
          <button type="submit" className="btn-primary flex-1 justify-center h-11" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Penghuni"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
