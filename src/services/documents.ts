import { apiClient, ApiResponse } from './api';

export interface Document {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  file_path?: string;
  is_global: boolean;
  created_at: string;
  updated_at: string;
  mime_type?: string;
  file_size_bytes?: number;
  status: 'pending_processing' | 'active' | 'archived' | 'error_processing';
}

export interface SearchResult {
  id: string;
  filename: string;
  content?: string;
  similarity: number;
}

export interface UploadDocumentRequest {
  file: File;
  title: string;
  is_global?: boolean;
}

export interface SearchDocumentsRequest {
  query: string;
  limit?: number;
}

class DocumentService {
  async getDocuments(): Promise<ApiResponse<{ documents: Document[] }>> {
    return apiClient.get<{ documents: Document[] }>('/documents');
  }

  async getDocument(id: string): Promise<ApiResponse<{ document: Document }>> {
    return apiClient.get<{ document: Document }>(`/documents/${id}`);
  }

  async uploadDocument(uploadData: UploadDocumentRequest): Promise<ApiResponse<{ document: Document }>> {
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('title', uploadData.title);
    if (uploadData.is_global !== undefined) {
      formData.append('is_global', uploadData.is_global.toString());
    }

    return apiClient.postFormData<{ document: Document }>('/documents/upload', formData);
  }

  async deleteDocument(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/documents/${id}`);
  }

  async searchDocuments(searchParams: SearchDocumentsRequest): Promise<ApiResponse<{ query: string; results: SearchResult[] }>> {
    const params = new URLSearchParams({
      query: searchParams.query,
      ...(searchParams.limit && { limit: searchParams.limit.toString() }),
    });

    return apiClient.get<{ query: string; results: SearchResult[] }>(`/documents/search?${params}`);
  }
}

export const documentService = new DocumentService();