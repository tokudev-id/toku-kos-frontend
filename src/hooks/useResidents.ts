import { useEffect, useState, useCallback } from 'react';
import { residentService } from '@/api/resident.service';
import type { Resident } from '@/api/resident.service';

// useDisclosure hook (simple implementation since we haven't extracted it to common yet)
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);
  return { isOpen, open, close, toggle };
}

export function useResidents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const addModal = useDisclosure();
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [checkoutResident, setCheckoutResident] = useState<Resident | null>(null);
  const [ktpResident, setKtpResident] = useState<Resident | null>(null);
  const [ktpViewMode, setKtpViewMode] = useState<'view' | 'upload'>('view');
  const [assignRoomResident, setAssignRoomResident] = useState<Resident | null>(null);

  // Local state for operations
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpUploading, setKtpUploading] = useState(false);

  const fetchResidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await residentService.getResidents(page, 10, search);
      setResidents(response.data);
      setTotal(response.total);
    } catch {
      setResidents([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResidents();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchResidents]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResident) return;
    setSaving(true);
    setSaveError(null);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const data = {
        emergency_contact: formData.get('emergency_contact') as string,
        notes: formData.get('notes') as string,
      };
      await residentService.updateResident(editingResident.id, data);
      setEditingResident(null);
      fetchResidents();
    } catch {
      setSaveError('Gagal menyimpan perubahan. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const onCheckoutConfirm = async () => {
    if (!checkoutResident) return;
    setSaving(true);
    setSaveError(null);
    try {
      await residentService.checkoutResident(checkoutResident.id);
      setCheckoutResident(null);
      fetchResidents();
    } catch {
      setSaveError('Checkout gagal diproses. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const onKtpUpload = async () => {
    if (!ktpResident || !ktpFile) return;
    setKtpUploading(true);
    setSaveError(null);
    try {
      await residentService.uploadKtp(ktpResident.id, ktpFile);
      setKtpFile(null);
      setKtpResident(null);
      fetchResidents();
    } catch {
      setSaveError('Upload KTP gagal. Pastikan file valid lalu coba lagi.');
    } finally {
      setKtpUploading(false);
    }
  };

  return {
    residents,
    total,
    page,
    setPage,
    search,
    setSearch,
    viewMode,
    setViewMode,
    isLoading,
    fetchResidents,
    
    // Modals
    addModal,
    editingResident,
    setEditingResident,
    checkoutResident,
    setCheckoutResident,
    ktpResident,
    setKtpResident,
    ktpViewMode,
    setKtpViewMode,
    assignRoomResident,
    setAssignRoomResident,
    
    // Form management
    saving,
    saveError,
    setSaveError,
    ktpFile,
    setKtpFile,
    ktpUploading,
    
    // Handlers
    handleUpdate,
    onCheckoutConfirm,
    onKtpUpload,
  };
}
