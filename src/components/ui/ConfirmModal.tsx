"use client";

import { Modal } from "./modal";
import { Button } from "@/components/ui-elements/button";
import { useLanguage } from "@/contexts/LanguageContext";

export type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "warning" | "info" | "success";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  cancelText,
  variant = "warning",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useLanguage();
  const _title = title ?? t("common.areYouSure");
  const _confirmText = confirmText ?? t("common.confirm");
  const _cancelText = cancelText ?? t("common.cancel");

  const icons = {
    warning: (
      <svg
        className="w-10 h-10 text-red-600 dark:text-red-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.29 3.86L1.82 18a1 1 0 00.85 1.5h18.66a1 1 0 00.85-1.5L13.71 3.86a1 1 0 00-1.71 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v4m0 4h.01"
        />
      </svg>
    ),
    info: (
      <svg
        className="w-10 h-10 text-blue-600 dark:text-blue-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        />
      </svg>
    ),
    success: (
      <svg
        className="w-10 h-10 text-green-600 dark:text-green-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      className="!h-auto !max-h-none w-full !max-w-md rounded-[15px] bg-white p-6 shadow-3"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icons[variant]}</div>
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">{_title}</h3>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</p>}
        <div className="flex justify-center gap-3">
          <Button variant="outlineDark" size="small" shape="rounded" onClick={onCancel} label={_cancelText} />
          {variant === "warning" ? (
            <Button
              size="small"
              shape="rounded"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={onConfirm}
              label={_confirmText}
            />
          ) : variant === "info" ? (
            <Button variant="primary" size="small" shape="rounded" onClick={onConfirm} label={_confirmText} />
          ) : (
            <Button variant="green" size="small" shape="rounded" onClick={onConfirm} label={_confirmText} />
          )}
        </div>
      </div>
    </Modal>
  );
}