// frontend/src/layout/HeaderCandidato.tsx
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeaderCandidato: React.FC = () => {
  return (
    <header className="candidate-theme sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--bg-primary)] shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo / Marca */}
        <div className="flex items-center space-x-3">
          {/* Logo com gradient roxo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl innova-gradient font-bold text-white shadow-md">
            N
          </div>
          <div>
            <h1 className="text-xl font-bold text-innova-gradient">Nome da Empresa</h1>
            <nav className="text-sm">
              <Link 
                to="/" 
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-200"
              >
                Portal do Candidato
              </Link>
            </nav>
          </div>
        </div>

        {/* Navegação Central */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* se necessário, links extras aqui */}
        </nav>

        {/* Ações do usuário */}
        <div className="flex items-center space-x-4">          
          <Link
            to="/perfil"
            className="flex h-10 w-10 transform items-center justify-center rounded-full innova-gradient hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <FaUserCircle className="text-2xl text-white" />
          </Link>
        </div>
      </div>
      
      {/* Navegação Mobile */}
      <div className="md:hidden border-t border-[var(--card-border)] bg-[var(--bg-secondary)]">
        <div className="flex justify-around py-3 text-sm">
          <Link 
            to="/vagas" 
            className="px-4 py-2 font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
          >
            Vagas
          </Link>
          <Link 
            to="/perfil" 
            className="px-4 py-2 font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
          >
            Perfil
          </Link>
          <Link 
            to="/curriculos" 
            className="px-4 py-2 font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
          >
            Currículos
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderCandidato;
