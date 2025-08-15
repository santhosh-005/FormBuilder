import axios from 'axios';
import type { Form, CreateFormData, Submission } from '../types/form';
import { getIdTokenCurrentUser } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to automatically add auth headers
api.interceptors.request.use(
  async (config) => {
    // Skip auth for public endpoints only
    const isPublicEndpoint = (
      config.url === '/forms' || 
      (config.url?.startsWith('/form/') && config.method?.toLowerCase() === 'get') ||
      (config.url?.includes('/submissions') && config.method?.toLowerCase() === 'post')
    );

    if (!isPublicEndpoint) {
      try {
        const token = await getIdTokenCurrentUser();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('❌ Error getting auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - log the error but don't force redirect
      console.error('Authentication failed. Please log in again.');
      // Let the React Router and AuthContext handle the redirect naturally
      // Don't force window.location.href here as it causes redirect loops
    }
    return Promise.reject(error);
  }
);

// API response wrapper type
interface ApiResponse<T> {
  message: string;
  data: T;
  pagination?: any;
}

export const createForm = async (data: CreateFormData): Promise<Form> => {
  const authHeaders = await getAuthHeaders();
  const response = await api.post<ApiResponse<Form>>('/forms', data, {
    headers: authHeaders
  });
  return response.data.data;
};

export const getAllForms = async (params?: { page?: number; limit?: number; search?: string }) => {
  const response = await api.get<ApiResponse<Form[]>>('/forms', { params });
  return response.data;
};

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    const token = await getIdTokenCurrentUser();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  } catch (error) {
    console.error('❌ Error getting auth token:', error);
    return {};
  }
};

export const getMyForms = async (params?: { page?: number; limit?: number; search?: string }) => {
  const authHeaders = await getAuthHeaders();
  const response = await api.get<ApiResponse<Form[]>>('/forms/my', { 
    params,
    headers: authHeaders
  });
  return response.data;
};

export const getForm = async (formId: string): Promise<Form> => {
  const response = await api.get<ApiResponse<Form>>(`/forms/${formId}`);
  return response.data.data;
};

export const updateForm = async (formId: string, data: Partial<CreateFormData>): Promise<Form> => {
  const authHeaders = await getAuthHeaders();
  const response = await api.put<ApiResponse<Form>>(`/forms/${formId}`, data, {
    headers: authHeaders
  });
  return response.data.data;
};

export const deleteForm = async (formId: string): Promise<void> => {
  const authHeaders = await getAuthHeaders();
  await api.delete(`/forms/${formId}`, {
    headers: authHeaders
  });
};

export const submitForm = async (formId: string, data: any): Promise<any> => {
  const response = await api.post<ApiResponse<Submission>>(`/forms/${formId}/submissions`, data);
  return response.data.data;
};

export const getFormSubmissions = async (formId: string, params?: { page?: number; limit?: number }) => {
  const authHeaders = await getAuthHeaders();
  const response = await api.get<ApiResponse<Submission[]>>(`/forms/${formId}/submissions`, { 
    params,
    headers: authHeaders
  });
  return response.data;
};
