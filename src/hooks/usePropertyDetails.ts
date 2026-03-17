import { useCallback, useEffect, useState } from 'react';
import { propertyService } from '@/api/property.service';
import type { Property } from '@/api/property.service';
import { roomService } from '@/api/room.service';
import type { Room } from '@/api/room.service';
import type { PropertyFormData } from './useProperties';

export type RoomFormData = {
  room_code: string;
  type: Room['type'];
  price_per_month: number;
  price_per_year: number;
  floor: string;
  size: string;
  deposit: number;
  electricity_included: boolean;
  water_included: boolean;
  facilities: string;
  image_ids: string[];
  status: Room['status'];
};

const EMPTY_PROP_FORM: PropertyFormData = {
  name: '',
  address: '',
  city: '',
  province: '',
  zip_code: '',
  description: '',
  notes: '',
};

const EMPTY_ROOM_FORM: RoomFormData = {
  room_code: '',
  type: 'STANDARD',
  price_per_month: 1,
  price_per_year: 0,
  floor: '',
  size: '',
  deposit: 0,
  electricity_included: false,
  water_included: false,
  facilities: '',
  image_ids: [],
  status: 'AVAILABLE',
};

export function usePropertyDetails(propertyId: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [roomListVersion, setRoomListVersion] = useState(0);

  const [editingProperty, setEditingProperty] = useState(false);
  const [propForm, setPropForm] = useState<PropertyFormData>(EMPTY_PROP_FORM);
  const [savingProp, setSavingProp] = useState(false);
  const [propError, setPropError] = useState('');

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState<RoomFormData>(EMPTY_ROOM_FORM);
  const [savingRoom, setSavingRoom] = useState(false);
  const [roomError, setRoomError] = useState('');

  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [deletingRoomId, setDeletingRoomId] = useState(false);

  const fetchData = useCallback(async () => {
    if (!propertyId) return;
    try {
      setError('');
      const propData = await propertyService.getProperty(propertyId);
      setProperty(propData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat detail properti.');
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
    setRoomListVersion((v) => v + 1);
  }, [fetchData]);

  const openEditProperty = () => {
    if (!property) return;
    setPropError('');
    setPropForm({
      name: property.name,
      address: property.address,
      city: property.city || '',
      province: property.province || '',
      zip_code: property.zip_code || '',
      description: property.description || '',
      notes: property.notes || '',
    });
    setEditingProperty(true);
  };

  const closeEditProperty = () => setEditingProperty(false);

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setSavingProp(true);
    setPropError('');
    try {
      await propertyService.updateProperty(property.id, propForm);
      setEditingProperty(false);
      await fetchData();
    } catch (err) {
      setPropError(err instanceof Error ? err.message : 'Gagal memperbarui properti.');
    } finally {
      setSavingProp(false);
    }
  };

  const openEditRoom = (room: Room) => {
    setRoomError('');
    setRoomForm({
      room_code: room.room_code,
      type: room.type,
      price_per_month: room.price_per_month,
      price_per_year: room.price_per_year || 0,
      floor: room.floor || '',
      size: room.size || '',
      deposit: room.deposit || 0,
      electricity_included: room.electricity_included || false,
      water_included: room.water_included || false,
      facilities: room.facilities?.join(', ') || '',
      image_ids: room.images?.map((img) => img.id) || [],
      status: room.status,
    });
    setEditingRoom(room);
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    setSavingRoom(true);
    setRoomError('');
    try {
      await roomService.updateRoom(editingRoom.id, {
        ...roomForm,
        price_per_month: Number(roomForm.price_per_month) || 1,
        price_per_year: roomForm.price_per_year ? Number(roomForm.price_per_year) : undefined,
        deposit: roomForm.deposit ? Number(roomForm.deposit) : undefined,
        facilities: roomForm.facilities
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setEditingRoom(null);
      refetch();
    } catch (err) {
      setRoomError(err instanceof Error ? err.message : 'Gagal memperbarui kamar.');
    } finally {
      setSavingRoom(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!deletingRoom) return;
    setDeletingRoomId(true);
    try {
      await roomService.deleteRoom(deletingRoom.id);
      setDeletingRoom(null);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus kamar.');
    } finally {
      setDeletingRoomId(false);
    }
  };

  return {
    property,
    isLoading,
    error,
    roomListVersion,
    refetch,
    editingProperty,
    propForm,
    setPropForm,
    savingProp,
    propError,
    openEditProperty,
    closeEditProperty,
    handleUpdateProperty,
    editingRoom,
    setEditingRoom,
    roomForm,
    setRoomForm,
    savingRoom,
    roomError,
    openEditRoom,
    handleUpdateRoom,
    deletingRoom,
    setDeletingRoom,
    deletingRoomId,
    handleDeleteRoom,
  };
}
