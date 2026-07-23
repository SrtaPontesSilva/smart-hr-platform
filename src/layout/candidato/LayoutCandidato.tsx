// layout/LayoutCandidato.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

import FooterCandidato from './FooterCandidato';
import HeaderCandidato from './HeaderCandidato';

const LayoutCandidato: React.FC = () => {
  return (
    <div className="candidate-theme flex min-h-screen flex-col bg-innova-subtle">
      <HeaderCandidato />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterCandidato />
    </div>
  );
};

export default LayoutCandidato;
