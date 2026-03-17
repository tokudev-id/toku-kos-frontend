import { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { propertyService } from '@/api/property.service';
import { PropertyFormFields } from '@/components/property/PropertyFormFields';
import type { PropertyFormData } from '@/hooks/useProperties';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_FORM: PropertyFormData = {
  name: '', address: '', city: '', province: '', zip_code: '', description: '', notes: '',
};

export function AddPropertyModal({ isOpen, onClose, onSuccess }: AddPropertyModalProps) {
  const [formData, setFormData] = useState<PropertyFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await propertyService.createProperty(formData);
      onSuccess();
      onClose();
      setFormData(EMPTY_FORM);
    } catch (error) {
      console.error('Failed to create property:', error);
      setSubmitError(error instanceof Error ? error.message : 'Gagal menambahkan properti. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Properti Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{submitError}</div>
        )}
        <PropertyFormFields values={formData} onChange={setFormData} />
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
            {isSubmitting ? 'Menyimpan...' : 'Simpan Properti'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
