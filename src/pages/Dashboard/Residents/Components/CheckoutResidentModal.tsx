import { Modal } from '@/components/molecules';
import { LogOut } from 'lucide-react';
import type { Resident } from '@/api/resident.service';

interface CheckoutResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
  onConfirm: () => Promise<void>;
  saving: boolean;
}

export function CheckoutResidentModal({
  isOpen,
  onClose,
  resident,
  onConfirm,
  saving,
}: CheckoutResidentModalProps) {
  if (!resident) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Checkout"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-center py-4">
        <div className="w-16 h-16 bg-warning/10 text-warning rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut size={32} />
        </div>
        <p className="text-text-secondary leading-relaxed">
          Penghuni <strong>{resident.full_name}</strong> akan di-checkout dari kamar. Status akan berubah menjadi Checkout.
        </p>
        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="btn-secondary flex-1">Batal</button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="btn-primary bg-warning hover:bg-warning/90 border-warning flex-1"
          >
            {saving ? 'Memproses...' : 'Ya, Checkout'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
