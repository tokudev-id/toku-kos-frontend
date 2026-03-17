import { useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, Loader2, UploadCloud, X } from 'lucide-react';
import { mediaService } from '@/api/media.service';
import type { Media, MediaType } from '@/api/media.service';

interface MediaPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  type: MediaType;
  maxFiles?: number;
}

export function MediaPicker({ selectedIds, onChange, type, maxFiles }: MediaPickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item.id)),
    [items, selectedIds],
  );

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      try {
        const response = await mediaService.getAll(type, 1, 100);
        setItems(response.data);
      } catch (error) {
        console.error('Failed to load media library:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [type]);

  const handleSelect = (id: string) => {
    const isSelected = selectedIds.includes(id);
    if (isSelected) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
      return;
    }

    if (maxFiles && selectedIds.length >= maxFiles) {
      return;
    }

    onChange([...selectedIds, id]);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    setUploadError('');
    setIsUploading(true);
    try {
      const uploadedItems: Media[] = [];
      for (const file of Array.from(files)) {
        const uploaded = await mediaService.upload(file, type);
        uploadedItems.push(uploaded);
      }

      setItems((prev) => [...uploadedItems, ...prev]);
      const uploadedIds = uploadedItems.map((item) => item.id);
      const nextIds = [...selectedIds, ...uploadedIds];
      onChange(maxFiles ? nextIds.slice(0, maxFiles) : nextIds);
    } catch (error) {
      console.error('Failed to upload media:', error);
      setUploadError(error instanceof Error ? error.message : 'Gagal upload media.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`border border-dashed rounded-xl p-4 transition-colors ${isDragging ? 'border-brand-primary bg-brand-primary-soft/40' : 'border-border-default bg-surface-bg/40'}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleUpload(event.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => void handleUpload(event.target.files)}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border-default bg-white hover:bg-slate-50 text-sm"
          disabled={isUploading}
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          {isUploading ? 'Mengunggah...' : 'Upload Gambar'}
        </button>
        <p className="text-xs text-text-secondary mt-2 text-center">
          Drag & drop gambar ke area ini atau klik tombol upload.
        </p>
        {uploadError && (
          <p className="text-xs text-danger mt-2">{uploadError}</p>
        )}
      </div>

      <div>
        <p className="input-label mb-2">Library ({items.length})</p>
        {isLoading ? (
          <div className="text-sm text-text-secondary italic">Memuat media...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-text-secondary italic">Belum ada media untuk tipe ini.</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${isSelected ? 'border-brand-primary' : 'border-border-default'}`}
                >
                  <img src={item.url} alt={item.original_name || 'media'} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-brand-primary/15 flex items-start justify-end p-1">
                      <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <p className="input-label mb-2">Terpilih ({selectedItems.length}{maxFiles ? `/${maxFiles}` : ''})</p>
        {selectedItems.length === 0 ? (
          <div className="text-sm text-text-secondary italic">Belum ada gambar dipilih.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <div key={item.id} className="relative w-14 h-14 rounded-lg border border-border-default">
                <img src={item.url} alt={item.original_name || 'selected media'} className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-white flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {maxFiles && selectedIds.length >= maxFiles && (
        <div className="text-xs text-warning flex items-center gap-1">
          <ImagePlus size={14} />
          Batas maksimum gambar telah tercapai.
        </div>
      )}
    </div>
  );
}
