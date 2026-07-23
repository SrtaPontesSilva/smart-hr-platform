// frontend/src/features/RH/management/components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'w-3 h-3';
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-6 h-6';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-primary';
      case 'white':
        return 'text-white';
      case 'gray':
        return 'text-gray-500';
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-danger';
      default:
        return 'text-primary';
    }
  };

  return (
    <div 
      className={`inline-block ${getSizeClasses()} ${getColorClasses()} ${className}`}
      role="status"
      aria-label="Carregando..."
    >
      <svg 
        className="animate-spin" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Variante com texto
interface LoadingSpinnerWithTextProps extends LoadingSpinnerProps {
  text?: string;
  textPosition?: 'right' | 'bottom';
}

export const LoadingSpinnerWithText: React.FC<LoadingSpinnerWithTextProps> = ({
  text = 'Carregando...',
  textPosition = 'right',
  ...spinnerProps
}) => {
  const isHorizontal = textPosition === 'right';
  
  return (
    <div className={`flex items-center ${isHorizontal ? 'gap-2' : 'flex-col gap-1'}`}>
      <LoadingSpinner {...spinnerProps} />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {text}
      </span>
    </div>
  );
};

// Componente de loading para tela inteira
export const FullPageLoader: React.FC<{ message?: string }> = ({ 
  message = 'Carregando...' 
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <LoadingSpinner size="lg" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          {message}
        </p>
      </div>
    </div>
  );
};

// Componente de loading para botões
export const ButtonLoader: React.FC<{ 
  loading: boolean; 
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ loading, children, className = '', disabled, onClick }) => {
  return (
    <button
      className={`relative ${className} ${loading || disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
        </div>
      )}
      <span className={loading ? 'invisible' : 'visible'}>
        {children}
      </span>
    </button>
  );
};