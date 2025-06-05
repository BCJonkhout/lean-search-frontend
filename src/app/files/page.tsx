"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { documentService } from "@/services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert } from "@/components/ui-elements/alert";
import { Button } from "@/components/ui-elements/button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import SwitcherOne from "@/components/FormElements/Switchers/SwitcherOne";

interface FileItem {
  id: string;
  title: string;
  file_path?: string;
  mime_type?: string;
  file_size_bytes?: number;
  created_at: string;
  updated_at: string;
  status: 'pending_processing' | 'active' | 'archived' | 'error_processing';
  is_global?: boolean;
}

export default function FilesPage() {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{variant: 'error' | 'success' | 'warning', title: string, description: string} | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetFileId, setTargetFileId] = useState<string | null>(null);
  const [showGlobalFiles, setShowGlobalFiles] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await documentService.getDocuments();
      if (response.success && response.data) {
        setFiles(response.data.documents || []);
      } else {
        setError("Failed to load files");
      }
    } catch (err) {
      setError("Failed to load files");
      console.error("Error loading files:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter files based on the toggle
  const filteredFiles = files.filter(file => {
    if (showGlobalFiles) {
      return file.is_global === true;
    } else {
      return file.is_global !== true; // This includes both false and undefined
    }
  });

  const promptDelete = (fileId: string) => {
    setTargetFileId(fileId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetFileId) return;
    try {
      const response = await documentService.deleteDocument(targetFileId);
      if (response.success) {
        setFiles(files.filter(file => file.id !== targetFileId));
      } else {
        setAlert({ variant: 'error', title: t('files.deleteError'), description: '' });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setAlert({ variant: 'error', title: t('files.deleteError'), description: '' });
    } finally {
      setConfirmOpen(false);
      setTargetFileId(null);
    }
  };

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const response = await documentService.downloadDocument(fileId);
      if (response.success && response.data) {
        // Create download link
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setAlert({variant: 'error', title: t('files.downloadError'), description: ''});
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      setAlert({variant: 'error', title: t('files.downloadError'), description: ''});
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_processing: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', text: t('files.processing') },
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', text: t('files.processed') },
      archived: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300', text: t('files.archived') },
      error_processing: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', text: t('files.failed') }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_processing;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <div className="text-gray-500 dark:text-gray-400">{t('common.loadingFiles')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {alert && (
        <div className="mb-6">
          <Alert
            variant={alert.variant}
            title={alert.title}
            description={alert.description}
          />
        </div>
      )}
      <div className="mb-7.5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-body-2xlg font-bold text-dark dark:text-white mb-2">
              {showGlobalFiles ? t('admin.globalFilesTitle') : t('files.title')}
            </h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
            </div>
          </div>
          <Button
            label={t('files.uploadFile')}
            variant="primary"
            shape="rounded"
            size="small"
            onClick={() => router.push('/new-file')}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            }
          />
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-dark dark:text-white">
              {t('admin.userFiles')}
            </span>
            <SwitcherOne
              id="globalFileSwitch"
              enabled={showGlobalFiles}
              setEnabled={setShowGlobalFiles}
            />
            <span className="text-sm font-medium text-dark dark:text-white">
              {t('common.globalFiles')}
            </span>
          </div>
        )}
      </div>

      {filteredFiles.length === 0 ? (
        <div className="grid rounded-[10px] bg-white px-7.5 pb-15 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="text-center py-15">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              {t('files.noFiles')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t('files.noFilesDesc')}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="border-none uppercase">
                <TableHead className="min-w-[200px] !text-left">
                  {t('files.name')}
                </TableHead>
                <TableHead className="text-center">
                  {t('files.size')}
                </TableHead>
                <TableHead className="text-center">
                  {t('files.status')}
                </TableHead>
                <TableHead className="text-center">
                  {t('files.uploaded')}
                </TableHead>
                <TableHead className="!text-right">
                  {t('files.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow
                  key={file.id}
                  className="text-base font-medium text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="!text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {file.title}
                          {file.is_global && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Global
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {file.mime_type || 'Unknown type'}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    {formatFileSize(file.file_size_bytes || 0)}
                  </TableCell>

                  <TableCell className="text-center">
                    {getStatusBadge(file.status)}
                  </TableCell>

                  <TableCell className="text-center text-gray-500 dark:text-gray-400">
                    {formatDate(file.created_at)}
                  </TableCell>

                  <TableCell className="!text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => handleDownload(file.id, file.title)}
                        className="p-2 text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={t('files.download')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => promptDelete(file.id)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={t('files.delete')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <ConfirmModal
        open={confirmOpen}
        title={t('files.confirmDelete')}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
        variant="warning"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}