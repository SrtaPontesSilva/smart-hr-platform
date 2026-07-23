// ==========================================
// Modal.tsx - Versão Refinada
// ==========================================
import React, { ReactNode, useEffect } from 'react';
import { FaTimes, FaUser } from 'react-icons/fa';

import { useTheme } from '../../../context/ThemeContext';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  footerActions?: ReactNode;
  className?: string;
  subtitle?: string;
  icon?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ 
  title, 
  isOpen, 
  onClose, 
  children, 
  footerActions, 
  className,
  subtitle,
  icon
}) => {
  const { darkMode } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop com blur e animação */}
      <div 
        className={`absolute inset-0 transition-all duration-300 ease-out ${
          darkMode 
            ? 'bg-black/70 backdrop-blur-sm' 
            : 'bg-black/50 backdrop-blur-sm'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div
        className={`relative max-h-[95vh] w-full max-w-6xl scale-100 transform transition-all duration-300 ease-out ${
          darkMode 
            ? 'border border-gray-700 bg-gray-900 text-white shadow-2xl' 
            : 'border border-gray-200 bg-white text-gray-900 shadow-2xl'
        } overflow-hidden rounded-2xl ${className || ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Refinado */}
        <header className={`relative px-6 py-5 ${
          darkMode 
            ? 'border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-800/90' 
            : 'border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Ícone do Modal */}
              <div className={`rounded-xl p-2.5 ${
                darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                {icon || <FaUser className="text-lg" />}
              </div>
              
              {/* Título e Subtítulo */}
              <div>
                <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                {subtitle && (
                  <p className={`mt-0.5 text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            {/* Botão de Fechar */}
            <button
              onClick={onClose}
              className={`rounded-xl p-2.5 transition-all duration-200 ${
                darkMode 
                  ? 'text-gray-400 hover:bg-gray-700/50 hover:text-white' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              aria-label="Fechar modal"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </header>

        {/* Content com scroll otimizado */}
        <main className="scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 max-h-[calc(95vh-180px)] overflow-y-auto scrollbar-thin">
          {children}
        </main>

        {/* Footer Refinado */}
        {footerActions && (
          <footer className={`px-6 py-4 ${
            darkMode 
              ? 'border-t border-gray-700 bg-gray-800/50' 
              : 'border-t border-gray-200 bg-gray-50/50'
          } flex items-center justify-end gap-3`}>
            {footerActions}
          </footer>
        )}
      </div>
    </div>
  );
};

export default Modal;
