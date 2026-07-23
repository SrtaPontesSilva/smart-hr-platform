// ==========================================
// ConfirmModal.tsx - Versão Refinada
// ==========================================
import React from 'react';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

import Modal from '../../../shared/components/modals/Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirmação',
  message,
  onConfirm,
  onCancel,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <FaExclamationTriangle className="text-red-500" />,
          confirmClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          iconBgClass: 'bg-red-100 dark:bg-red-900/30'
        };
      case 'info':
        return {
          icon: <FaExclamationTriangle className="text-blue-500" />,
          confirmClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          iconBgClass: 'bg-blue-100 dark:bg-blue-900/30'
        };
      default:
        return {
          icon: <FaExclamationTriangle className="text-yellow-500" />,
          confirmClass: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          iconBgClass: 'bg-yellow-100 dark:bg-yellow-900/30'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onCancel}
      className="max-w-md"
      icon={config.icon}
      footerActions={
        <div className="flex gap-3">
          <button 
            onClick={onConfirm} 
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.confirmClass}`}
          >
            <FaCheck className="text-xs" />
            {confirmText}
          </button>
          <button 
            onClick={onCancel} 
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <FaTimes className="text-xs" />
            {cancelText}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-4 p-6">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${config.iconBgClass}`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
