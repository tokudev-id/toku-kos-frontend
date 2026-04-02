import { AddPropertyModal } from '@/components/AddPropertyModal';
import { DeletePropertyModal } from '@/features/properties/components/DeletePropertyModal';
import { EditPropertyModal } from '@/features/properties/components/EditPropertyModal';
import { PropertiesGrid } from '@/features/properties/components/PropertiesGrid';
import { PropertiesHeader } from '@/features/properties/components/PropertiesHeader';
import { PropertiesSearchBar } from '@/features/properties/components/PropertiesSearchBar';
import { usePropertiesPage } from '@/features/properties/hooks/usePropertiesPage';

export default function Properties() {
  const {
    properties,
    isLoading,
    searchQuery,
    setSearchQuery,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    reloadProperties,
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
  } = usePropertiesPage();

  return (
    <div className="space-y-lg">
      <PropertiesHeader onAddProperty={openCreateModal} />
      <PropertiesSearchBar value={searchQuery} onChange={setSearchQuery} />
      <PropertiesGrid
        properties={properties}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onAddFirstProperty={openCreateModal}
      />

      <AddPropertyModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={reloadProperties}
      />

      <EditPropertyModal
        property={editingProperty}
        form={editForm}
        onClose={closeEditModal}
        onChange={updateEditForm}
        onSubmit={submitEdit}
        isSaving={isSaving}
      />

      <DeletePropertyModal
        property={deletingProperty}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
