import { apiClient, ApiResponse } from './api';

export interface User {
  id: string;
  first_name: string;
  surname: string;
  name?: string;
  email: string;
  organisation?: string;
  bio?: string;
  system_prompt?: string;
  role: 'ADMIN' | 'USER';
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  surname: string;
  email: string;
  password: string;
  organisation?: string;
  bio?: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  surname?: string;
  email?: string;
  password?: string;
  organisation?: string;
  bio?: string;
  system_prompt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get<{ user: User }>('/auth/profile');
  }

  async updateProfile(userData: UpdateProfileRequest): Promise<ApiResponse<{ user: User }>> {
    return apiClient.put<{ user: User }>('/auth/profile', userData);
  }

  async logout(): Promise<ApiResponse> {
    return apiClient.post('/auth/logout');
  }

  // Client-side auth helpers
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): Partial<User> | null {
    if (typeof window === 'undefined') return null;
    
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');
    
    if (!name || !email || !userId) return null;
    
    const [first_name, ...surnameArray] = name.split(' ');
    return {
      id: userId,
      first_name,
      surname: surnameArray.join(' '),
      email,
    };
  }

  storeAuthData(authResponse: AuthResponse): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('name', `${authResponse.user.first_name} ${authResponse.user.surname}`);
    localStorage.setItem('email', authResponse.user.email);
    localStorage.setItem('userId', authResponse.user.id);
    window.dispatchEvent(new Event('authChanged'));
  }

  clearAuthData(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('authChanged'));
  }
}

export const authService = new AuthService();