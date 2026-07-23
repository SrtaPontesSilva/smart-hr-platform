// ==========================================
// DesignSystemMerged.tsx - Sistema de Design Unificado (merge)
// Combina o Design System existente (Innova) com o arquivo enviado (tokens + extras)
// Mantém API atual dos componentes: Button, Input, Badge, Card, Select, Loading, Alert, Divider
// Adiciona: designTokens, SectionHeader, InputField, SelectField, UIButton (alternativa ao Button),
// Toggle, LoadingSpinner, EmptyState, TokenCard (variante de Card baseada em tokens)
// ==========================================

import React, { ReactNode } from 'react';
import { FaSpinner } from 'react-icons/fa';

import { useTheme } from '../../context/ThemeContext';

// ==========================================
// TIPOS EXISTENTES (Innova)
// ==========================================
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type InputSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  help?: string;
  size?: InputSize;           // <-- seu size ('sm' | 'md' | 'lg')
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  hover?: boolean;
  className?: string;
}

// ==========================================
// DESIGN TOKENS (do arquivo enviado)
// ==========================================
export const designTokens = {
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  typography: {
    heading: {
      h1: 'text-2xl font-bold tracking-tight',
      h2: 'text-xl font-semibold tracking-tight',
      h3: 'text-lg font-semibold',
      h4: 'text-base font-semibold',
      h5: 'text-sm font-semibold',
    },
    body: { large: 'text-base', medium: 'text-sm', small: 'text-xs' },
    label: 'text-sm font-medium',
  },
  colors: {
    primary: 'blue',
    secondary: 'gray',
    success: 'green',
    warning: 'yellow',
    danger: 'red',
    info: 'blue',
  },
  borders: {
    radius: { sm: 'rounded-lg', md: 'rounded-xl', lg: 'rounded-2xl', full: 'rounded-full' },
    width: { thin: 'border', thick: 'border-2' },
  },
  shadows: { sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg', xl: 'shadow-xl' },
  transitions: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
  },
};

// ==========================================
// VARIANTES DE ESTILO (Innova)
// ==========================================
const buttonVariants: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-primary text-white shadow-innova
    hover:shadow-innova-md hover:-translate-y-0.5 
    focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `,
  secondary: `
    bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 
    border border-slate-300 dark:border-slate-600 shadow-sm
    hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500
    focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  success: `
    bg-success-600 text-white shadow-sm
    hover:bg-success-700 hover:-translate-y-0.5
    focus:ring-4 focus:ring-success-200 dark:focus:ring-success-800
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `,
  warning: `
    bg-warning-600 text-white shadow-sm
    hover:bg-warning-700 hover:-translate-y-0.5
    focus:ring-4 focus:ring-warning-200 dark:focus:ring-warning-800
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `,
  danger: `
    bg-danger-600 text-white shadow-sm
    hover:bg-danger-700 hover:-translate-y-0.5
    focus:ring-4 focus:ring-danger-200 dark:focus:ring-danger-800
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `,
  ghost: `
    text-slate-600 dark:text-slate-400
    hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100
    focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};

const buttonSizes: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
  xl: 'px-8 py-4 text-lg rounded-xl',
};

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300',
  success: 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300',
  danger: 'bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
};

// ==========================================
// COMPONENTES (API existente Innova)
// ==========================================
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-200
    focus:outline-none focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900
  `;

  const classes = [
    baseClasses,
    buttonVariants[variant],
    buttonSizes[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || loading;

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {loading ? (
        <>
          <FaSpinner className="animate-spin mr-2" size={size === 'xs' ? 12 : 14} />
          Carregando...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className={children ? 'mr-2' : ''}>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className={children ? 'ml-2' : ''}>{icon}</span>}
        </>
      )}
    </button>
  );
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  help,
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputSizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  } as const;

  const inputClasses = `
    input-base transition-all duration-200
    ${inputSizes[size]}
    ${error ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200 dark:border-danger-600 dark:focus:border-danger-400' : ''}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-slate-400 dark:text-slate-500">{leftIcon}</div>
          </div>
        )}

        <input id={inputId} className={inputClasses} {...props} />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-slate-400 dark:text-slate-500">{rightIcon}</div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400" role="alert">
          {error}
        </p>
      )}

      {help && !error && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{help}</p>}
    </div>
  );
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md', dot = false, className = '' }) => {
  const sizeClasses = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-0.5 text-xs', lg: 'px-3 py-1 text-sm' } as const;
  const classes = ['inline-flex items-center font-medium rounded-full', badgeVariants[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {dot && <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />}
      {children}
    </span>
  );
};

export const Card: React.FC<CardProps> = ({ children, padding = 'md', shadow = 'sm', border = true, hover = false, className = '' }) => {
  const paddingClasses = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6', xl: 'p-8' } as const;
  const shadowClasses = { none: '', sm: 'shadow-sm', md: 'shadow-innova', lg: 'shadow-innova-md', xl: 'shadow-innova-lg' } as const;

  const classes = [
    'card-base',
    paddingClasses[padding],
    shadowClasses[shadow],
    border ? '' : 'border-0',
    hover ? 'hover:shadow-innova-md hover:-translate-y-0.5 cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  help?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select: React.FC<SelectProps> = ({ label, error, help, options, className = '', id, ...props }) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const selectClasses = `
    input-base transition-all duration-200
    ${error ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200 dark:border-danger-600 dark:focus:border-danger-400' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}

      <select id={selectId} className={selectClasses} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400" role="alert">
          {error}
        </p>
      )}

      {help && !error && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{help}</p>}
    </div>
  );
};

export interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', color = 'primary', text, className = '' }) => {
  const sizeClasses = { xs: 'w-4 h-4', sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-10 h-10' } as const;
  const colorClasses = { primary: 'text-primary-600 dark:text-primary-400', secondary: 'text-slate-600 dark:text-slate-400', white: 'text-white' } as const;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FaSpinner className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} />
      {text && <span className={`ml-3 text-sm ${colorClasses[color]}`}>{text}</span>}
    </div>
  );
};

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, variant = 'info', title, dismissible = false, onDismiss, className = '' }) => {
  const variantClasses = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-700 dark:text-success-300',
    warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800 text-warning-700 dark:text-warning-300',
    danger: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300',
  } as const;

  return (
    <div className={`rounded-lg border p-4 ${variantClasses[variant]} ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && onDismiss && (
          <button onClick={onDismiss} className="ml-4 text-current hover:opacity-75 transition-opacity" aria-label="Fechar alerta">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export interface DividerProps { orientation?: 'horizontal' | 'vertical'; className?: string; children?: React.ReactNode }
export const Divider: React.FC<DividerProps> = ({ orientation = 'horizontal', className = '', children }) => {
  if (orientation === 'vertical') return <div className={`w-px bg-slate-200 dark:bg-slate-700 ${className}`} />;
  if (children) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">{children}</span>
        </div>
      </div>
    );
  }
  return <hr className={`border-slate-200 dark:border-slate-700 ${className}`} />;
};

// ==========================================
// COMPONENTES ADICIONAIS (do arquivo enviado)
// — mantidos com nomes diferentes para evitar colisões
// ==========================================

// TokenCard: variante de Card baseada em tokens/ThemeContext
interface TokenCardProps { children: ReactNode; className?: string; variant?: 'default' | 'elevated' | 'outlined'; padding?: 'sm' | 'md' | 'lg' }
export const TokenCard: React.FC<TokenCardProps> = ({ children, className = '', variant = 'default', padding = 'lg' }) => {
  const { darkMode } = useTheme();
  const baseClasses = `${designTokens.borders.radius.md} ${designTokens.transitions.normal}`;
  const variantClasses = {
    default: `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`,
    elevated: `${darkMode ? 'bg-gray-800' : 'bg-white'} ${designTokens.shadows.sm} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`,
    outlined: `${darkMode ? 'bg-transparent border-gray-700' : 'bg-transparent border-gray-200'} border-2`,
  } as const;
  const paddingClasses = { sm: 'p-4', md: 'p-6', lg: 'p-8' } as const;
  return <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}>{children}</div>;
};

// SectionHeader
interface SectionHeaderProps { title: string; subtitle?: string; icon?: ReactNode; badge?: string | number; actions?: ReactNode; collapsible?: boolean; isExpanded?: boolean; onToggle?: () => void }
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon, badge, actions, collapsible = false, isExpanded = true, onToggle }) => {
  const { darkMode } = useTheme();
  const Component: any = collapsible ? 'button' : 'div';
  return (
    <Component
      onClick={collapsible ? onToggle : undefined}
      className={`flex w-full items-center justify-between ${collapsible ? '-m-2 cursor-pointer rounded-lg p-2 hover:bg-gray-50/50 dark:hover:bg-gray-700/50' : ''} ${designTokens.transitions.normal}`}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className={`rounded-xl p-3 ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>{icon}</div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h3 className={`${designTokens.typography.heading.h3} text-gray-900 dark:text-gray-100`}>{title}</h3>
            {badge && (
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{badge}</span>
            )}
            {collapsible && (
              <svg className={`h-5 w-5 text-gray-400 ${designTokens.transitions.normal} ${isExpanded ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {actions && !collapsible && <div className="flex items-center gap-2">{actions}</div>}
    </Component>
  );
};

// Campos de formulário simples (controlados)
interface InputFieldProps { label: string; value: string | number; onChange: (value: string) => void; type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel'; placeholder?: string; icon?: ReactNode; required?: boolean; disabled?: boolean; error?: string; helper?: string }
export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = 'text', placeholder, icon, required = false, disabled = false, error, helper }) => {
  const { darkMode } = useTheme();
  return (
    <div className="space-y-1.5">
      <label className={`block ${designTokens.typography.label} text-gray-700 dark:text-gray-200`}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <div className="text-sm text-gray-400">{icon}</div>
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm ${designTokens.transitions.normal} focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${icon ? 'pl-10' : ''} ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50 dark:border-red-600' : darkMode ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helper && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{helper}</p>}
    </div>
  );
};

interface SelectFieldProps { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; placeholder?: string; required?: boolean; disabled?: boolean; error?: string }
export const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options, placeholder = 'Selecione uma opção', required = false, disabled = false, error }) => {
  const { darkMode } = useTheme();
  return (
    <div className="space-y-1.5">
      <label className={`block ${designTokens.typography.label} text-gray-700 dark:text-gray-200`}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm ${designTokens.transitions.normal} focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50 dark:border-red-600' : darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a 1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

// UIButton: versão alternativa do Button baseada no arquivo enviado (mantida para quem quiser usar o estilo "blue")
interface UIButtonProps { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'; size?: 'sm' | 'md' | 'lg'; disabled?: boolean; loading?: boolean; icon?: ReactNode; iconPosition?: 'left' | 'right'; fullWidth?: boolean; type?: 'button' | 'submit' | 'reset' }
export const UIButton: React.FC<UIButtonProps> = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, loading = false, icon, iconPosition = 'left', fullWidth = false, type = 'button' }) => {
  const { darkMode } = useTheme();
  const baseClasses = `inline-flex items-center justify-center gap-2 font-medium rounded-lg ${designTokens.transitions.normal} focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${fullWidth ? 'w-full' : ''}`;
  const sizeClasses = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' } as const;
  const variantClasses = {
    primary: `bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}`,
    secondary: `${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500'}`,
    success: `bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow-md`,
    warning: `bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500 shadow-sm hover:shadow-md`,
    danger: `bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md`,
    ghost: `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 focus:ring-gray-500' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'}`,
  } as const;
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {loading && (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && <span className="text-sm">{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span className="text-sm">{icon}</span>}
    </button>
  );
};

// Toggle
interface ToggleProps { checked: boolean; onChange: (checked: boolean) => void; label?: string; disabled?: boolean }
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, disabled = false }) => {
  const { darkMode } = useTheme();
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${designTokens.transitions.normal} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${checked ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm ${designTokens.transitions.normal} ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
      {label && <span className={`text-sm font-medium ${checked ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>{label}</span>}
    </div>
  );
};

// LoadingSpinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' } as const;
  return (
    <div className="flex items-center justify-center">
      <svg className={`animate-spin ${sizeClasses[size]} text-blue-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  );
};

// EmptyState
interface EmptyStateProps { icon?: ReactNode; title: string; subtitle?: string; action?: ReactNode }
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle, action }) => {
  return (
    <div className="py-12 text-center">
      {icon && <div className="mx-auto mb-4 text-4xl text-gray-300 dark:text-gray-600">{icon}</div>}
      <h4 className={`${designTokens.typography.heading.h4} mb-2 text-gray-900 dark:text-gray-100`}>{title}</h4>
      {subtitle && <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      {action}
    </div>
  );
};

// ==========================================
// EXPORTS DE TIPOS (reexpostos)
// ==========================================
export type { UIButtonProps, TokenCardProps, SectionHeaderProps, InputFieldProps as SimpleInputFieldProps, SelectFieldProps as SimpleSelectFieldProps, ToggleProps };
