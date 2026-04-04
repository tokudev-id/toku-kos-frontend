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
  error?: string | null;
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
  error,
}: KtpModalProps) {
  if (!resident) return null;

  const residentKtpUrl = resident.profile?.identity_card_url || resident.identity_card_url;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={viewMode === 'view' ? 'Lihat KTP' : 'Upload KTP'}
      maxWidth="max-w-md"
    >
      {viewMode === 'view' ? (
        <div className="space-y-4">
          {residentKtpUrl ? (
            <div className="rounded-lg border border-border-default overflow-hidden bg-slate-50">
              <img src={residentKtpUrl} alt={`Dokumen identitas ${resident.profile?.full_name || resident.full_name || 'penghuni'}`} className="w-full h-auto" />
            </div>
          ) : (
            <div className="rounded-lg border border-border-default bg-slate-50 p-6 text-center text-sm text-text-secondary">
              Dokumen KTP belum tersedia.
            </div>
          )}
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
          {error && (
            <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}
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
