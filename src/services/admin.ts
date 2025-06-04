import { apiClient, ApiResponse } from './api';
import { User } from './auth';

export interface GetUsersResponse {
  users: User[];
}

class AdminService {
  async getUsers(): Promise<ApiResponse<GetUsersResponse>> {
    return apiClient.get<GetUsersResponse>('/auth/users');
  }

  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/auth/users/${userId}`);
  }
}

export const adminService = new AdminService();