// frontend/src/features/RH/management/components/Toast.tsx
import React, { useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';

interface ToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  show, 
  message, 
  type, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-white border-success';
      case 'error':
        return 'bg-danger text-white border-danger';
      case 'warning':
        return 'bg-warning text-white border-warning';
      case 'info':
      default:
        return 'bg-primary text-white border-primary';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaIcons.FaCheckCircle className="text-lg" />;
      case 'error':
        return <FaIcons.FaExclamationCircle className="text-lg" />;
      case 'warning':
        return <FaIcons.FaExclamationTriangle className="text-lg" />;
      case 'info':
      default:
        return <FaIcons.FaInfoCircle className="text-lg" />;
    }
  };

  return (
    <div className="fixed right-4 top-4 z-50 w-full max-w-sm">
      <div 
        className={`
          ${getToastStyles()}
          transform rounded-lg border-l-4 p-4 
          shadow-lg transition-all duration-300 ease-in-out
          ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
        role="alert"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 inline-flex text-white transition-colors hover:text-gray-200 focus:text-gray-200 focus:outline-none"
            aria-label="Fechar notificação"
          >
            <FaIcons.FaTimes className="text-sm" />
          </button>
        </div>

        {/* Barra de progresso */}
        {duration > 0 && (
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/20">
            <div 
              className="h-1 rounded-full bg-white"
              style={{
                animation: `progress ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>

      {/* Animação via style tag segura para React */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes progress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `
        }}
      />
    </div>
  );
};

// Hook para usar toast facilmente
export const useToast = () => {
  const [toast, setToast] = React.useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return {
    toast,
    showToast,
    hideToast,
    ToastComponent: (
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    )
  };
};
