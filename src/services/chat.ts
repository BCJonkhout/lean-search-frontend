import { apiClient, ApiResponse } from './api';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  message_order: number;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  system_prompt_snapshot?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ConversationWithMessages {
  conversation: Conversation;
  messages: ChatMessage[];
}

class ChatService {
  async getConversations(): Promise<ApiResponse<{ conversations: Conversation[] }>> {
    return apiClient.get<{ conversations: Conversation[] }>('/ai/conversations');
  }

  async getConversation(id: string): Promise<ApiResponse<ConversationWithMessages>> {
    return apiClient.get<ConversationWithMessages>(`/ai/conversations/${id}`);
  }

  async chat(
    chatRequest: ChatRequest,
    onChunk: (chunk: string) => void,
    onError: (error: any) => void,
    onComplete: (conversationId?: string) => void
  ): Promise<{ message: string; conversationId?: string }> {
    try {
      const response = await apiClient.postStream('/ai/chat', chatRequest);

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let fullResponse = "";
      let responseConversationId: string | undefined;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process complete lines only
        let newlineIndex = buffer.indexOf('\n');
        while (newlineIndex !== -1) {
          const line = buffer.substring(0, newlineIndex).trim();
          buffer = buffer.substring(newlineIndex + 1);

          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.substring(6); // Remove "data: " prefix
              const data = JSON.parse(jsonStr);
              
              if (data.token) {
                fullResponse += data.token;
                onChunk(data.token);
              } else if (data.done) {
                responseConversationId = data.conversation_id;
                onComplete(responseConversationId);
                return { message: fullResponse, conversationId: responseConversationId };
              } else if (data.error) {
                onError(new Error(data.error));
                return { message: fullResponse };
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', line, e);
            }
          }

          newlineIndex = buffer.indexOf('\n');
        }
      }

      onComplete(responseConversationId);
      return { message: fullResponse, conversationId: responseConversationId };
    } catch (error) {
      onError(error);
      throw error;
    }
  }
}

export const chatService = new ChatService();