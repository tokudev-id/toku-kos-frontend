import { useEffect, useMemo, useState } from 'react';
import { propertyService } from '@/api/property.service';
import type { Property } from '@/api/property.service';

export interface PropertyEditFormValues {
  name: string;
  address: string;
  city: string;
  province: string;
  description: string;
}

const EMPTY_EDIT_FORM: PropertyEditFormValues = {
  name: '',
  address: '',
  city: '',
  province: '',
  description: '',
};

export function usePropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState<PropertyEditFormValues>(EMPTY_EDIT_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProperties = async () => {
    try {
      const response = await propertyService.getProperties();
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();

    return properties.filter((property) => {
      return (
        property.name.toLowerCase().includes(normalizedQuery) ||
        property.address.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [properties, searchQuery]);

  const openEditModal = (property: Property) => {
    setEditForm({
      name: property.name,
      address: property.address,
      city: property.city || '',
      province: property.province || '',
      description: property.description || '',
    });
    setEditingProperty(property);
  };

  const closeEditModal = () => {
    setEditingProperty(null);
    setEditForm(EMPTY_EDIT_FORM);
  };

  const updateEditForm = <K extends keyof PropertyEditFormValues>(
    field: K,
    value: PropertyEditFormValues[K]
  ) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const submitEdit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editingProperty) {
      return;
    }

    setIsSaving(true);

    try {
      await propertyService.updateProperty(editingProperty.id, editForm);
      closeEditModal();
      await loadProperties();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (property: Property) => {
    setDeletingProperty(property);
  };

  const closeDeleteModal = () => {
    setDeletingProperty(null);
  };

  const confirmDelete = async () => {
    if (!deletingProperty) {
      return;
    }

    setIsDeleting(true);

    try {
      await propertyService.deleteProperty(deletingProperty.id);
      closeDeleteModal();
      await loadProperties();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    properties: filteredProperties,
    isLoading,
    searchQuery,
    setSearchQuery,
    isCreateModalOpen,
    openCreateModal: () => setIsCreateModalOpen(true),
    closeCreateModal: () => setIsCreateModalOpen(false),
    reloadProperties: loadProperties,
    editingProperty,
    editForm,
    updateEditForm,
    openEditModal,
    closeEditModal,
    submitEdit,
    isSaving,
    deletingProperty,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    isDeleting,
  };
}
