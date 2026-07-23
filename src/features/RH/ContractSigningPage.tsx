// src/pages/rh/ContractSigningPage.tsx
import React, { useMemo, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

import PageHeader from '../../layout/RH/PageHeader';
import useLocalStorage from '../../shared/hooks/useLocalStorage';

interface ContractData {
  id: number;
  nome: string;
  contratoGerado: boolean;
  contratoAssinadoEmpresa: boolean;
  contratoAssinadoCandidato: boolean;
  historico?: string[];
}

const initialData: ContractData[] = [
  {
    id: 1,
    nome: 'João Silva',
    contratoGerado: true,
    contratoAssinadoEmpresa: true,
    contratoAssinadoCandidato: false,
    historico: ['Contrato gerado em 2025-07-01', 'Assinado pela empresa em 2025-07-02'],
  },
  {
    id: 2,
    nome: 'Maria Oliveira',
    contratoGerado: false,
    contratoAssinadoEmpresa: false,
    contratoAssinadoCandidato: false,
    historico: [],
  },
  {
    id: 3,
    nome: 'Carlos Santos',
    contratoGerado: true,
    contratoAssinadoEmpresa: true,
    contratoAssinadoCandidato: true,
    historico: [
      'Contrato gerado em 2025-06-28',
      'Assinado pela empresa em 2025-06-29',
      'Assinado pelo candidato em 2025-06-30',
    ],
  },
];

// mapeia status -> classes e progresso
const getStatus = (c: ContractData) => {
  if (!c.contratoGerado) {
    return { 
      label: 'Não iniciado', 
      badgeClass: 'bg-slate-500 text-white', 
      barClass: 'bg-slate-500', 
      progress: 0, 
      key: 'pendente' as const 
    };
  }
  if (c.contratoAssinadoEmpresa && c.contratoAssinadoCandidato) {
    return { 
      label: 'Concluído', 
      badgeClass: 'bg-green-500 text-white', 
      barClass: 'bg-green-500', 
      progress: 100, 
      key: 'concluido' as const 
    };
  }
  if (c.contratoAssinadoEmpresa || c.contratoAssinadoCandidato) {
    return { 
      label: 'Parcial', 
      badgeClass: 'bg-orange-500 text-white', 
      barClass: 'bg-orange-500', 
      progress: 50, 
      key: 'parcial' as const 
    };
  }
  return { 
    label: 'Pendente', 
    badgeClass: 'bg-red-500 text-white', 
    barClass: 'bg-red-500', 
    progress: 25, 
    key: 'pendente' as const 
  };
};

const ContractSigningPage: React.FC = () => {
  const [contratos, setContratos] = useLocalStorage<ContractData[]>('contrato_candidatos', initialData);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendente' | 'parcial' | 'concluido'>('todos');
  const [ordemAsc, setOrdemAsc] = useState(true);

  // Estatísticas para o cabeçalho
  const stats = useMemo(() => {
    const total = contratos.length;
    const naoIniciados = contratos.filter(c => !c.contratoGerado).length;
    const pendentes = contratos.filter(c => {
      const status = getStatus(c);
      return status.key === 'pendente' && c.contratoGerado;
    }).length;
    const parciais = contratos.filter(c => getStatus(c).key === 'parcial').length;
    const concluidos = contratos.filter(c => getStatus(c).key === 'concluido').length;

    return { total, naoIniciados, pendentes, parciais, concluidos };
  }, [contratos]);

  const update = (id: number, changes: Partial<ContractData>, actionLabel?: string) => {
    setContratos(prev =>
      prev.map(c => {
        if (c.id === id) {
          const historico = actionLabel ? [...(c.historico || []), `${actionLabel} em ${new Date().toLocaleDateString()}`] : c.historico;
          return { ...c, ...changes, historico };
        }
        return c;
      })
    );
  };

  const contratosFiltrados = useMemo(() => {
    return contratos
      .filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()))
      .filter(c => {
        const status = getStatus(c).key;
        return filtroStatus === 'todos' || filtroStatus === status;
      })
      .sort((a, b) => {
        const progA = getStatus(a).progress;
        const progB = getStatus(b).progress;
        return ordemAsc ? progA - progB : progB - progA;
      });
  }, [contratos, busca, filtroStatus, ordemAsc]);

  const enviarLink = (id: number, nome: string) => {
    update(id, {}, 'Link de formulário enviado');
    alert(`Link de formulário enviado para ${nome}`);
  };

  const reenviarLink = (id: number, nome: string) => {
    update(id, {}, 'Link de formulário reenviado');
    alert(`Link de formulário reenviado para ${nome}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Padronizado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageHeader
          title="Gestão de Contratos"
          subtitle="Gerencie contratos e assinaturas digitais"
          actions={
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaFileContract className="w-4 h-4 text-slate-600 dark:text-slate-400 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.total}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaClock className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.pendentes}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Pendentes</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaEdit className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.parciais}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Parciais</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaCheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.concluidos}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Concluídos</div>
              </div>
            </div>
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Filtros e Controles */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FaIcons.FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                         focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                aria-label="Buscar por nome do candidato"
              />
            </div>

            {/* Filtros de Status */}
            <div className="flex items-center gap-2">
              <FaIcons.FaFilter className="text-slate-500 w-4 h-4" />
              <div className="flex gap-2 text-sm">
                {(['todos', 'pendente', 'parcial', 'concluido'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFiltroStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      filtroStatus === status
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabela Principal */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Contratos ({contratosFiltrados.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              {contratosFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <FaIcons.FaFileContract className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 mb-2">Nenhum contrato encontrado</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Verifique os filtros ou adicione um candidato</p>
                </div>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-3 text-slate-800 dark:text-slate-100 font-medium">Candidato</th>
                      <th className="px-6 py-3 text-slate-800 dark:text-slate-100 font-medium">Status</th>
                      <th 
                        className="px-6 py-3 text-slate-800 dark:text-slate-100 font-medium cursor-pointer hover:text-primary-500 transition-colors"
                        onClick={() => setOrdemAsc(!ordemAsc)}
                      >
                        <span className="flex items-center gap-1">
                          Progresso 
                          {ordemAsc ? <FaIcons.FaSortUp /> : <FaIcons.FaSortDown />}
                        </span>
                      </th>
                      <th className="px-6 py-3 text-slate-800 dark:text-slate-100 font-medium">Ações</th>
                      <th className="px-6 py-3 text-slate-800 dark:text-slate-100 font-medium">Histórico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contratosFiltrados.map((candidato, index) => {
                      const status = getStatus(candidato);
                      return (
                        <tr
                          key={candidato.id}
                          className={`transition-colors ${
                            index % 2 === 0 
                              ? 'bg-slate-50 dark:bg-slate-700/50' 
                              : 'bg-white dark:bg-slate-800'
                          } hover:bg-primary-50 dark:hover:bg-primary-900/10`}
                        >
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                            {candidato.nome}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.badgeClass}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-32">
                              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                                <span>{status.progress}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${status.barClass}`}
                                  style={{ width: `${status.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {!candidato.contratoGerado ? (
                                <>
                                  <button
                                    onClick={() => update(candidato.id, { contratoGerado: true }, 'Contrato gerado')}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                                  >
                                    <FaIcons.FaFileContract className="w-3 h-3" /> Gerar
                                  </button>
                                  <button
                                    onClick={() => enviarLink(candidato.id, candidato.nome)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                  >
                                    <FaIcons.FaPaperPlane className="w-3 h-3" /> Enviar
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => update(candidato.id, { contratoAssinadoEmpresa: true }, 'Assinado pela empresa')}
                                    disabled={candidato.contratoAssinadoEmpresa}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                      candidato.contratoAssinadoEmpresa 
                                        ? 'bg-green-500 text-white cursor-not-allowed' 
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                  >
                                    <FaIcons.FaBuilding className="w-3 h-3" /> Empresa
                                  </button>
                                  <button
                                    onClick={() => update(candidato.id, { contratoAssinadoCandidato: true }, 'Assinado pelo candidato')}
                                    disabled={candidato.contratoAssinadoCandidato}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                      candidato.contratoAssinadoCandidato 
                                        ? 'bg-green-500 text-white cursor-not-allowed' 
                                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                                    }`}
                                  >
                                    <FaIcons.FaUserTie className="w-3 h-3" /> Candidato
                                  </button>
                                  <button
                                    onClick={() => reenviarLink(candidato.id, candidato.nome)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                                  >
                                    <FaIcons.FaRedo className="w-3 h-3" /> Reenviar
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              {candidato.historico && candidato.historico.length > 0 ? (
                                <div className="space-y-1">
                                  {candidato.historico.slice(-2).map((h, i) => (
                                    <div key={i} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 p-2 rounded">
                                      {h}
                                    </div>
                                  ))}
                                  {candidato.historico.length > 2 && (
                                    <div className="text-xs text-slate-400 dark:text-slate-500">
                                      +{candidato.historico.length - 2} mais
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500">---</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas Resumidas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.naoIniciados}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Não Iniciados</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pendentes}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Pendentes</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.parciais}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Parciais</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.concluidos}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Concluídos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSigningPage;