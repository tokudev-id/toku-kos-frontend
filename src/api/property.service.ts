import api from './axios';

export interface Property {
  id: string;
  name: string;
  address: string;
  city?: string;
  province?: string;
  zip_code?: string;
  description?: string;
  notes?: string;
  total_rooms?: number;
  available_rooms?: number;
  created_at: string;
}

type PropertyPayload = {
  name: string;
  address: string;
  city?: string;
  province?: string;
  zip_code?: string;
  description?: string;
  notes?: string;
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const propertyService = {
  normalizeProperty: (property: Property): Property => ({
    ...property,
    description: property.description ?? property.notes,
  }),

  toBackendPayload: (data: Partial<PropertyPayload>) => ({
    ...data,
    notes: data.notes ?? data.description,
    description: data.description ?? data.notes,
  }),

  getProperties: async (page = 1, limit = 10, search?: string) => {
    const response = await api.get<PaginatedResponse<Property>>('/properties', {
      params: { page, limit, search },
    });
    return {
      ...response.data,
      data: response.data.data.map((property) => propertyService.normalizeProperty(property)),
    };
  },

  getProperty: async (id: string) => {
    const response = await api.get<Property>(`/properties/${id}`);
    return propertyService.normalizeProperty(response.data);
  },

  createProperty: async (data: PropertyPayload) => {
    const response = await api.post<Property>('/properties', propertyService.toBackendPayload(data));
    return propertyService.normalizeProperty(response.data);
  },

  updateProperty: async (id: string, data: Partial<PropertyPayload>) => {
    const response = await api.patch<Property>(`/properties/${id}`, propertyService.toBackendPayload(data));
    return propertyService.normalizeProperty(response.data);
  },

  deleteProperty: async (id: string) => {
    await api.delete(`/properties/${id}`);
  },
};
