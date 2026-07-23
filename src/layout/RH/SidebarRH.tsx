import React from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarRH: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  // Fecha a sidebar somente em telas menores
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-20 flex h-screen
        w-64 flex-col justify-between
        border-r border-gray-200 bg-white p-4 shadow-md transition-transform duration-300
        dark:border-gray-700 dark:bg-gray-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div>
        <div className="mb-6 flex items-center justify-center">
          <FaIcons.FaBuilding className="mr-2 text-3xl text-primary" />
          <h2 className="text-2xl font-bold text-primary dark:text-blue-300">RH</h2>
        </div>

        {/* Botão de Home */}
        <nav className="mb-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/rh"
                className="flex items-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={handleLinkClick}
              >
                <FaIcons.FaHome className="mr-3 text-lg" />
                <span className="font-medium">Home</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Título de seção */}
        <div className="mb-4 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
          Recrutamento
        </div>

        {/* Demais itens de navegação */}
        <nav>
          <ul className="space-y-2">
            {/* 🆕 Templates de Vagas */}
            <li>
              <Link
                to="/rh/templates-vagas"
                className="flex items-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={handleLinkClick}
              >
                <FaIcons.FaStickyNote className="mr-3 text-lg" />
                <span className="font-medium">Templates de Vagas</span>
              </Link>
            </li>

            <li>
              <Link
                to="/rh/processamento"
                className="flex items-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={handleLinkClick}
              >
                <FaIcons.FaFilter className="mr-3 text-lg" />
                <span className="font-medium">Processamento</span>
              </Link>
            </li>

            <li>
              <Link
                to="/rh/contratacao"
                className="flex items-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={handleLinkClick}
              >
                <FaIcons.FaFileSignature className="mr-3 text-lg" />
                <span className="font-medium">Contratação</span>
              </Link>
            </li>
          </ul>

          {/* Título de seção */}
          <div className="mb-2 mt-4 px-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            Gestão de Pessoal
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/rh/funcionarios"
                  className="flex items-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={handleLinkClick}
                >
                  <FaIcons.FaUsers className="mr-3 text-lg" />
                  <span className="font-medium">Funcionários</span>
                </Link>
              </li>

              {/* Desligamento */}
              <li>
                <Link
                  to="/rh/offboarding"
                  className="flex items-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={handleLinkClick}
                >
                  <FaIcons.FaUserMinus className="mr-3 text-lg" />
                  <span className="font-medium">Desligamento</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/rh/pagamentos"
                  className="flex items-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={handleLinkClick}
                >
                  <FaIcons.FaMoneyCheckAlt className="mr-3 text-lg" />
                  <span className="font-medium">Pagamentos</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/rh/monitoramento"
                  className="flex items-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={handleLinkClick}
                >
                  <FaIcons.FaChartBar className="mr-3 text-lg" />
                  <span className="font-medium">Monitoramento</span>
                </Link>
              </li>
            </ul>
          </nav>
        </nav>
      </div>

      {/* Ação de sair */}
      <div className="mt-8">
        <Link
          to="/logout"
          className="flex items-center rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800 dark:hover:bg-red-900 dark:hover:text-red-300"
          onClick={handleLinkClick}
        >
          <FaIcons.FaSignOutAlt className="mr-3 text-lg" />
          <span className="font-medium">Sair da conta</span>
        </Link>
      </div>
    </aside>
  );
};

export default SidebarRH;
