"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { adminService, User } from "@/services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert } from "@/components/ui-elements/alert";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{variant: 'error' | 'success' | 'warning', title: string, description: string} | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data.users || []);
      } else {
        setError("Failed to load users");
      }
    } catch (err) {
      setError("Failed to load users");
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const promptDeleteUser = (userId: string) => {
    setTargetUserId(userId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetUserId) return;
    try {
      const response = await adminService.deleteUser(targetUserId);
      if (response.success) {
        setUsers(users.filter(user => user.id !== targetUserId));
        setAlert({ variant: 'success', title: t('admin.userDeleted'), description: '' });
      } else {
        setAlert({ variant: 'error', title: t('admin.deleteUserError'), description: '' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlert({ variant: 'error', title: t('admin.deleteUserError'), description: '' });
    } finally {
      setConfirmOpen(false);
      setTargetUserId(null);
    }
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

  // Redirect or show error if not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <div className="text-red-500">Access denied. Admin privileges required.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <div className="text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
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
        <h1 className="text-body-2xlg font-bold text-dark dark:text-white mb-2">
          {t('admin.usersTitle')}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('admin.totalUsers')}: {users.length}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="grid rounded-[10px] bg-white px-7.5 pb-15 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="text-center py-15">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              {t('admin.noUsers')}
            </h3>
          </div>
        </div>
      ) : (
        <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="border-none uppercase">
                <TableHead className="min-w-[200px] !text-left">
                  {t('auth.name')}
                </TableHead>
                <TableHead className="min-w-[200px] !text-left">
                  {t('auth.email')}
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
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="text-base font-medium text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="!text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="!text-left">
                    {user.email}
                  </TableCell>

                  <TableCell className="text-center text-gray-500 dark:text-gray-400">
                    {formatDate(user.created_at)}
                  </TableCell>

                  <TableCell className="!text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => promptDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={t('admin.deleteUser')}
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
      title={t("admin.confirmDeleteUser")}
      confirmText={t("common.confirm")}
      cancelText={t("common.cancel")}
      variant="warning"
      onConfirm={handleConfirmDelete}
      onCancel={() => setConfirmOpen(false)}
    />
    </div>
  );
}