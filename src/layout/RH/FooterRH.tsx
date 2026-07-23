// frontend/src/layout/FooterRH.tsx
import React from 'react';

const FooterRH: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white p-4 text-center transition-colors dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} - RH | Sistema de Gestão
      </p>
    </footer>
  );
};

export default FooterRH;
