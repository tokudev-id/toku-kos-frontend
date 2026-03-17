import { useState, useEffect } from 'react';
import { propertyService, type Property } from '@/api/property.service';
import { roomService, type Room } from '@/api/room.service';
import { contractService, type AssignRoomPayload } from '@/api/contract.service';

export function useContracts(residentId: string | null, onSuccess?: () => void) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load properties for step 1
  useEffect(() => {
    if (residentId && step === 1) {
      loadProperties();
    }
  }, [residentId, step]);

  // Load rooms for step 2 when property is selected
  useEffect(() => {
    if (selectedProperty && step === 2) {
      loadRooms(selectedProperty.id);
    }
  }, [selectedProperty, step]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const response = await propertyService.getProperties(1, 100);
      setProperties(response.data);
    } catch (err) {
      setError('Gagal memuat daftar properti');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRooms = async (propertyId: string) => {
    setIsLoading(true);
    try {
      const response = await roomService.getRoomsByProperty(propertyId, 1, 100, undefined, undefined, 'AVAILABLE');
      setAvailableRooms(response.data);
    } catch (err) {
      setError('Gagal memuat daftar kamar');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelectedProperty(null);
    setSelectedRoom(null);
    setAvailableRooms([]);
    setError(null);
  };

  const submitAssignment = async (data: Omit<AssignRoomPayload, 'room_id'>) => {
    if (!residentId || !selectedRoom) return;
    
    setSaving(true);
    setError(null);
    try {
      await contractService.assignRoom(residentId, {
        ...data,
        room_id: selectedRoom.id,
      });
      onSuccess?.();
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat kontrak sewa');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    step,
    setStep,
    properties,
    selectedProperty,
    setSelectedProperty,
    availableRooms,
    selectedRoom,
    setSelectedRoom,
    isLoading,
    saving,
    error,
    submitAssignment,
    reset,
  };
}
