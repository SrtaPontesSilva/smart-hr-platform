// layout/FooterCandidato.tsx
import React from 'react';

const FooterCandidato: React.FC = () => {
  return (
    <footer className="bg-gray-200 p-4 text-center">
      <p className="text-sm text-gray-600">© {new Date().getFullYear()} - Empresa XYZ</p>
    </footer>
  );
};

export default FooterCandidato;
