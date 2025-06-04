import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  status?: number;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          success: false,
          message: 'An error occurred',
          status: error.response?.status,
        };

        if (error.response?.data && typeof error.response.data === 'object') {
          const responseData = error.response.data as any;
          apiError.message = responseData.message || apiError.message;
        } else if (error.message) {
          apiError.message = error.message;
        }

        // Handle 401 unauthorized - redirect to login
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('name');
          localStorage.removeItem('email');
          localStorage.removeItem('userId');
          window.dispatchEvent(new Event('authChanged'));
          
          // Only redirect if not already on an auth page
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith('/auth/')) {
            window.location.href = '/auth/sign-in';
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(endpoint, data);
    return response.data;
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(endpoint);
    return response.data;
  }

  async postStream(endpoint: string, data?: any): Promise<Response> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const response = await fetch(`${this.instance.defaults.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      window.location.href = '/auth/sign-in';
    }

    return response;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);