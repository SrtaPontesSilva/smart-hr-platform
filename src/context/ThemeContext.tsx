import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isRHArea: boolean;
  setIsRHArea: (isRH: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(false);
  const [isRHArea, setIsRHArea] = useState(false);

  const updateDocumentClasses = (isDark: boolean, isRH: boolean) => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.remove('dark');
    body.classList.remove('candidate-theme', 'rh-theme');

    if (isRH) {
      body.classList.add('rh-theme');

      if (isDark) {
        html.classList.add('dark');
      }
    } else {
      body.classList.add('candidate-theme');
    }
  };

  useEffect(() => {
    const isRH = location.pathname.startsWith('/rh');

    setIsRHArea(isRH);

    const stored = localStorage.getItem('innova-theme');

    const prefersDark = stored
      ? stored === 'dark'
      : window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

    updateDocumentClasses(isRH ? prefersDark : false, isRH);
    setDarkMode(isRH ? prefersDark : false);
  }, [location.pathname]);

  useEffect(() => {
    updateDocumentClasses(isRHArea ? darkMode : false, isRHArea);
  }, [isRHArea, darkMode]);

  const toggleDarkMode = () => {
    if (!isRHArea) {
      console.warn('Dark mode só está disponível na área RH');
      return;
    }

    setDarkMode((prev) => {
      const next = !prev;

      updateDocumentClasses(next, isRHArea);

      localStorage.setItem(
        'innova-theme',
        next ? 'dark' : 'light'
      );

      return next;
    });
  };

  const value: ThemeContextType = {
    darkMode,
    toggleDarkMode,
    isRHArea,
    setIsRHArea,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme deve ser usado dentro de ThemeProvider'
    );
  }

  return context;
};

export const useAreaDetection = () => {
  const location = useLocation();
  const { setIsRHArea } = useTheme();

  useEffect(() => {
    const isRH = location.pathname.startsWith('/rh');
    setIsRHArea(isRH);
  }, [location.pathname, setIsRHArea]);
};

export const DarkModeToggle: React.FC<{
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({
  className = '',
  showLabel = true,
  size = 'md',
}) => {
  const {
    darkMode,
    toggleDarkMode,
    isRHArea,
  } = useTheme();

  if (!isRHArea) {
    return null;
  }

  const sizes = {
    sm: 'h-6 w-11 p-0.5',
    md: 'h-7 w-12 p-1',
    lg: 'h-8 w-14 p-1.5',
  } as const;

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={`relative inline-flex items-center rounded-full transition focus:outline-none ring-0 bg-slate-200 dark:bg-slate-700 ${sizes[size]} ${className}`}
      aria-pressed={darkMode}
      aria-label="Alternar modo escuro"
    >
      <span
        className={`inline-block transform rounded-full bg-white dark:bg-slate-300 transition ${
          darkMode
            ? 'translate-x-5 md:translate-x-5 lg:translate-x-6'
            : 'translate-x-0'
        } ${
          size === 'sm'
            ? 'h-5 w-5'
            : size === 'md'
            ? 'h-5 w-5'
            : 'h-6 w-6'
        }`}
      />

      {showLabel && (
        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {darkMode ? 'Escuro' : 'Claro'}
        </span>
      )}
    </button>
  );
};

export const ThemePreview: React.FC = () => {
  const { darkMode, isRHArea } = useTheme();

  const colors = [
    { name: 'Primary', class: 'bg-primary' },
    { name: 'Secondary', class: 'bg-secondary' },
    { name: 'Accent', class: 'bg-accent' },
    { name: 'Card', class: 'card-innova' },
  ];

  return (
    <div className="card-innova p-6">
      <h3 className="text-lg font-semibold mb-4 text-innova-gradient">
        Prévia do Tema Atual
      </h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Área:</strong>{' '}
          {isRHArea ? 'RH' : 'Candidatos'}
        </div>

        <div>
          <strong>Modo:</strong>{' '}
          {darkMode ? 'Escuro' : 'Claro'}
        </div>

        <div>
          <strong>Classes aplicadas:</strong>
        </div>

        <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 ml-4">
          <li>{isRHArea ? 'rh-theme' : 'candidate-theme'}</li>
          {darkMode && <li>dark</li>}
        </ul>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {colors.map((color) => (
          <div
            key={color.name}
            className="text-center"
          >
            <div
              className={`h-12 w-full rounded ${color.class} mb-1`}
            />

            <div className="text-xs text-gray-600 dark:text-gray-400">
              {color.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};