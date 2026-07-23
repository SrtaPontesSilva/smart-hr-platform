// ==========================================
// TextInput.tsx - Componente de Input Refinado
// ==========================================
import React from 'react';

import { useTheme } from '../../../context/ThemeContext';

interface TextInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  error,
  className = '',
  icon,
  readOnly = false,
}) => {
  const { darkMode } = useTheme();

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className={`block text-sm font-medium transition-colors ${
        darkMode ? 'text-gray-200' : 'text-gray-700'
      } ${required ? 'after:ml-1 after:text-red-500 after:content-["*"]' : ''}`}>
        {label}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {icon}
            </span>
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
            icon ? 'pl-10' : ''
          } ${
            darkMode 
              ? 'focus:bg-gray-750 border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:bg-gray-50'
          } ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
              : ''
          } ${
            disabled 
              ? 'cursor-not-allowed opacity-60' 
              : ''
          } ${
            readOnly 
              ? 'cursor-default bg-gray-100 dark:bg-gray-700' 
              : ''
          }`}
        />
      </div>
      
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
