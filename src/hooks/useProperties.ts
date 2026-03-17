import { useCallback, useEffect, useState } from 'react';
import { propertyService } from '@/api/property.service';
import type { Property } from '@/api/property.service';

export type PropertyFormData = {
  name: string;
  address: string;
  city: string;
  province: string;
  zip_code: string;
  description: string;
  notes: string;
};

const EMPTY_FORM: PropertyFormData = {
  name: '',
  address: '',
  city: '',
  province: '',
  zip_code: '',
  description: '',
  notes: '',
};

export const PROPERTY_LIMIT = 9;

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState<PropertyFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await propertyService.getProperties(page, PROPERTY_LIMIT, debouncedSearch || undefined);
      setProperties(response.data);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data properti.');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const openEdit = (property: Property) => {
    setEditForm({
      name: property.name,
      address: property.address,
      city: property.city || '',
      province: property.province || '',
      zip_code: property.zip_code || '',
      description: property.description || '',
      notes: property.notes || '',
    });
    setEditError('');
    setEditingProperty(property);
  };

  const closeEdit = () => setEditingProperty(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    setSaving(true);
    setEditError('');
    try {
      await propertyService.updateProperty(editingProperty.id, editForm);
      setEditingProperty(null);
      await fetchProperties();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Gagal memperbarui properti.');
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (property: Property) => setDeletingProperty(property);
  const closeDelete = () => setDeletingProperty(null);

  const handleDelete = async () => {
    if (!deletingProperty) return;
    setDeleting(true);
    try {
      await propertyService.deleteProperty(deletingProperty.id);
      setDeletingProperty(null);
      await fetchProperties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus properti.');
    } finally {
      setDeleting(false);
    }
  };

  return {
    properties,
    total,
    page,
    setPage,
    search,
    setSearch,
    isLoading,
    error,
    fetchProperties,
    editingProperty,
    editForm,
    setEditForm,
    saving,
    editError,
    openEdit,
    closeEdit,
    handleUpdate,
    deletingProperty,
    deleting,
    openDelete,
    closeDelete,
    handleDelete,
  };
}
