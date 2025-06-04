"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatService, Conversation } from "@/services";
import { useLanguage } from "@/contexts/LanguageContext";
import InputGroup from "@/components/FormElements/InputGroup";
import { Modal } from "@/components/ui/modal";

interface ChatSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatSearchModal({ open, onClose }: ChatSearchModalProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadAllConversations();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = conversations.filter(conv => 
        (conv.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (!conv.title && "new conversation".includes(searchQuery.toLowerCase()))
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const loadAllConversations = async () => {
    try {
      setLoading(true);
      const response = await chatService.getConversations();
      if (response.success && response.data) {
        setConversations(response.data.conversations);
        setFilteredConversations(response.data.conversations);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    router.push(`/chat?id=${conversationId}`);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-h-[80vh] w-full max-w-2xl rounded-[15px] bg-white p-0 shadow-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h3 className="text-xl font-bold text-dark">
          {t('chats.searchTitle') || 'Search Conversations'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-6 pb-4">
        <InputGroup
          type="text"
          placeholder={t('chats.searchPlaceholder') || 'Search conversations...'}
          value={searchQuery}
          handleChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          label=""
        />
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 max-h-187.5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading conversations...</div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.291-4.701c-.111-.23-.169-.485-.169-.75 0-.449.361-.81.81-.81h5.35a2 2 0 001.8-1.12L14.5 8h1a2 2 0 012 2v.18" />
            </svg>
            <p className="text-gray-500">
              {searchQuery ? 
                (t('chats.noSearchResults') || 'No conversations found') :
                (t('chats.noConversations') || 'No conversations yet')
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {conversation.title || 'New conversation'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(conversation.updated_at)}
                    </p>
                  </div>
                  <div className="text-gray-400 ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}