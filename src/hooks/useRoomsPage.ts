import { useEffect, useState } from 'react';
import { useDisclosure } from './useModalState';
import { propertyService } from '@/api/property.service';
import type { Property } from '@/api/property.service';
import type { Room } from '@/api/room.service';

export function useRoomsPage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  const addModal = useDisclosure();
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const deleteModal = useDisclosure();

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await propertyService.getProperties(1, 100);
        setProperties(response.data);
      } catch (error) {
        console.error('Failed to load properties:', error);
        setProperties([]);
      } finally {
        setIsLoadingProperties(false);
      }
    };

    void loadProperties();
  }, []);

  const handleDeleteRoom = (room: Room) => {
    setDeletingRoom(room);
    deleteModal.open();
  };

  return {
    selectedPropertyId,
    setSelectedPropertyId,
    properties,
    isLoadingProperties,
    addModal,
    editingRoom,
    setEditingRoom,
    deletingRoom,
    setDeletingRoom,
    deleteModal,
    handleDeleteRoom,
  };
}
