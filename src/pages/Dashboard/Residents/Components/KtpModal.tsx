import { Modal } from '@/components/molecules';
import { Plus } from 'lucide-react';
import type { Resident } from '@/api/resident.service';

interface KtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
  viewMode: 'view' | 'upload';
  onKtpFileChange: (file: File | null) => void;
  ktpFile: File | null;
  onUpload: () => Promise<void>;
  uploading: boolean;
}

export function KtpModal({
  isOpen,
  onClose,
  resident,
  viewMode,
  onKtpFileChange,
  ktpFile,
  onUpload,
  uploading,
}: KtpModalProps) {
  if (!resident) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={viewMode === 'view' ? 'Lihat KTP' : 'Upload KTP'}
      maxWidth="max-w-md"
    >
      {viewMode === 'view' ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-border-default overflow-hidden bg-slate-50">
            <img src={resident.identity_card_url} alt="KTP" className="w-full h-auto" />
          </div>
          <button onClick={onClose} className="btn-secondary w-full">Tutup</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border-default rounded-xl p-8 text-center hover:bg-slate-50 transition-all cursor-pointer relative">
            <input
              type="file"
              id="ktp-upload"
              hidden
              onChange={(e) => onKtpFileChange(e.target.files?.[0] || null)}
            />
            <label htmlFor="ktp-upload" className="cursor-pointer">
              <Plus size={32} className="mx-auto mb-2 text-text-secondary" />
              <p className="text-sm font-bold">{ktpFile ? ktpFile.name : 'Pilih file KTP'}</p>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1">Batal</button>
            <button
              onClick={onUpload}
              disabled={!ktpFile || uploading}
              className="btn-primary flex-1"
            >
              {uploading ? 'Mengunggah...' : 'Upload KTP'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
