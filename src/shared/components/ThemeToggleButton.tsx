import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

import { useTheme } from '../../context/ThemeContext';

const ThemeToggleButton: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={`Ativar modo ${darkMode ? 'claro' : 'escuro'}`}
      title={`Ativar modo ${darkMode ? 'claro' : 'escuro'}`}
      className="transition-opacity hover:opacity-80"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={darkMode ? 'sun' : 'moon'}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          {darkMode ? (
            <FaSun className="text-yellow-400" size={20} />
          ) : (
            <FaMoon className="text-gray-900 dark:text-white" size={18} />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggleButton;
