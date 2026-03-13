import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { propertyService } from '@/api/property.service';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPropertyModal({ isOpen, onClose, onSuccess }: AddPropertyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await propertyService.createProperty(formData);
      onSuccess();
      onClose();
      setFormData({ name: '', address: '', description: '' });
    } catch (error) {
      console.error('Failed to create property:', error);
      alert('Gagal menambahkan properti. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Properti Baru">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="input-label" htmlFor="name">Nama Properti</label>
          <input 
            id="name"
            type="text" 
            placeholder="Contoh: Kosan Asri" 
            className="input-field"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="input-label" htmlFor="address">Alamat Lengkap</label>
          <textarea 
            id="address"
            placeholder="Jl. Merdeka No. 123, Jakarta" 
            className="input-field min-h-[100px] py-3"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="input-label" htmlFor="description">Deskripsi (Opsional)</label>
          <textarea 
            id="description"
            placeholder="Info tambahan mengenati kos ini..." 
            className="input-field min-h-[80px] py-3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="btn-secondary flex-1 justify-center h-11"
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="btn-primary flex-1 justify-center h-11"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Properti"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
