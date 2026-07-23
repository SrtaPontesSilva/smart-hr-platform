import React from 'react';
import * as FaIcons from 'react-icons/fa';

import { useTheme } from '../../context/ThemeContext';
import ThemeToggleButton from '../../shared/components/ThemeToggleButton';

interface HeaderProps {
  toggleSidebar: () => void;
}

const HeaderRH: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  // Desestruturamos apenas para manter a consistência, ignorando variáveis não utilizadas
  const { darkMode: _darkMode, toggleDarkMode: _toggleDarkMode } = useTheme();

  return (
    <header className="fixed left-64 right-0 top-0 z-30 bg-primary p-4 text-white shadow-sm transition-colors dark:bg-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        {/* Botão hambúrguer para telas menores */}
        <button
          className="mr-4 text-white focus:outline-none dark:text-gray-200 md:hidden"
          onClick={toggleSidebar}
        >
          <FaIcons.FaBars className="text-2xl" />
        </button>

        {/* Logo/Título */}
        <div className="flex items-center">
          <FaIcons.FaUserTie className="mr-2 text-2xl" />
          <h1 className="text-xl font-bold">Painel Geral - RH</h1>
        </div>

        {/* Ações do usuário */}
        <div className="flex items-center space-x-4">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
};

export default HeaderRH;
