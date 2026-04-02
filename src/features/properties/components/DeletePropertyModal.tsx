import { Trash2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import type { Property } from '@/api/property.service';

interface DeletePropertyModalProps {
  property: Property | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeletePropertyModal({
  property,
  onClose,
  onConfirm,
  isDeleting,
}: DeletePropertyModalProps) {
  return (
    <Modal
      isOpen={!!property}
      onClose={onClose}
      title="Hapus Properti?"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10 text-danger">
            <Trash2 size={18} />
          </div>
        </div>
        <p className="text-sm text-text-secondary">
          Properti <strong>{property?.name}</strong> akan dihapus permanen
          beserta semua data kamarnya. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn-primary flex-1 justify-center border-danger bg-danger hover:bg-danger/90"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Properti'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
