// frontend/src/shared/components/InputField.tsx
import React from 'react';

interface EnhancedInputFieldProps {
  label: string;
  type?: 'text' | 'number' | 'date';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const EnhancedInputField: React.FC<EnhancedInputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="mb-4">
      <label className="block">
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`mt-1 w-full border-b bg-transparent p-2 transition-colors focus:outline-none ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
        />
      </label>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default EnhancedInputField;
