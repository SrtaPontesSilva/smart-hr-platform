// frontend/src/layout/LayoutRH.tsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';

import FooterRH from './FooterRH';
import HeaderRH from './HeaderRH';
import SidebarRH from './SidebarRH';


const LayoutRH: React.FC = () => {
  const { darkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
      localStorage.setItem('sidebarOpen', JSON.stringify(true));
    } else {
      const storedSidebarOpen = localStorage.getItem('sidebarOpen');
      if (storedSidebarOpen !== null) {
        setSidebarOpen(JSON.parse(storedSidebarOpen));
      }
    }
  }, []);

  const toggleSidebar = () => {
    const newSidebarState = !sidebarOpen;
    setSidebarOpen(newSidebarState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newSidebarState));
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      {/* Sidebar fixa */}
      <SidebarRH isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header fixo */}
      <HeaderRH toggleSidebar={toggleSidebar} />

      {/* Container do conteúdo e footer com background que responde ao dark mode */}
      <div className="ml-64 flex min-h-screen flex-col bg-gray-100 pt-16 dark:bg-gray-900">
        <main className="flex-grow p-6">
          <Outlet />
        </main>
        <FooterRH />
      </div>
    </div>
  );
};

export default LayoutRH;
