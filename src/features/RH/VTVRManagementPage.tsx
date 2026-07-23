import React, { useState, useMemo } from 'react';
import * as FaIcons from 'react-icons/fa';

import PageHeader from '../../layout/RH/PageHeader';
import useLocalStorage from '../../shared/hooks/useLocalStorage';

interface Employee {
  id: number;
  nome: string;
  tipo: 'boleto' | 'PIX' | 'direto';
  vencimento: string;
  quantia: number;
  dataPagamento: string | null;
  salario: number;
  vtUnitario: number;
  vrUnitario: number;
  vtTotal: number;
  vrTotal: number;
  statusPagamento: 'Pendente' | 'Aprovado' | 'Pago';
  historicoExcel: string;
}

const VTVRManagementPage: React.FC = () => {
  const [funcionarios, setFuncionarios] = useLocalStorage<Employee[]>('vtvr_employees', [
    {
      id: 1,
      nome: 'Fulano da Silva',
      tipo: 'boleto',
      vencimento: '2025-03-05',
      quantia: 100,
      dataPagamento: null,
      salario: 3000,
      vtUnitario: 50,
      vrUnitario: 80,
      vtTotal: 150,
      vrTotal: 240,
      statusPagamento: 'Pendente',
      historicoExcel: '/history/fulano.xlsx',
    },
    {
      id: 2,
      nome: 'Maria Souza',
      tipo: 'PIX',
      vencimento: '2025-02-20',
      quantia: 200,
      dataPagamento: '2025-03-09',
      salario: 3500,
      vtUnitario: 200,
      vrUnitario: 300,
      vtTotal: 600,
      vrTotal: 900,
      statusPagamento: 'Pago',
      historicoExcel: '/history/maria.xlsx',
    },
  ]);

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'Pendente' | 'Aprovado' | 'Pago'>('todos');
  const [ordemAsc, setOrdemAsc] = useState(true);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const funcionariosFiltrados = useMemo(() => {
    return funcionarios
      .filter(emp => emp.nome.toLowerCase().includes(busca.toLowerCase()))
      .filter(emp => filtroStatus === 'todos' || emp.statusPagamento === filtroStatus)
      .sort((a, b) => {
        const totalA = a.salario + a.vtTotal + a.vrTotal;
        const totalB = b.salario + b.vtTotal + b.vrTotal;
        return ordemAsc ? totalA - totalB : totalB - totalA;
      });
  }, [funcionarios, busca, filtroStatus, ordemAsc]);

  // Estatísticas para o cabeçalho
  const stats = useMemo(() => {
    const total = funcionarios.length;
    const pendentes = funcionarios.filter(emp => emp.statusPagamento === 'Pendente').length;
    const aprovados = funcionarios.filter(emp => emp.statusPagamento === 'Aprovado').length;
    const pagos = funcionarios.filter(emp => emp.statusPagamento === 'Pago').length;
    const totalPagamentos = funcionarios.reduce((acc, emp) => acc + emp.salario + emp.vtTotal + emp.vrTotal, 0);
    const vencidos = funcionarios.filter(emp => new Date(emp.vencimento) < new Date()).length;

    return { total, pendentes, aprovados, pagos, totalPagamentos, vencidos };
  }, [funcionarios]);

  const getStatusClasses = (status: Employee['statusPagamento']) => {
    switch (status) {
      case 'Pendente':
        return 'bg-warning dark:bg-warning-dark';
      case 'Aprovado':
        return 'bg-primary dark:bg-primary-dark';
      case 'Pago':
        return 'bg-success dark:bg-success-dark';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  const handleAprovarPagamento = (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja aprovar o pagamento de ${nome}?`)) return;
    setFuncionarios(prev => prev.map(emp => emp.id === id ? { ...emp, statusPagamento: 'Aprovado' } : emp));
    alert(`Pagamento de ${nome} aprovado com sucesso!`);
  };

  const handleEfetuarPagamento = (id: number, nome: string) => {
    if (!window.confirm(`Confirma a efetivação do pagamento de ${nome}? Esta ação não pode ser desfeita.`)) return;
    setFuncionarios(prev => prev.map(emp =>
      emp.id === id
        ? { ...emp, statusPagamento: 'Pago', dataPagamento: new Date().toISOString() }
        : emp
    ));
    alert(`Pagamento de ${nome} efetuado com sucesso!`);
  };

  const handleExportExcel = () => {
    alert('Exportação para Excel iniciada.');
    setShowExportDropdown(false);
  };

  const handleExportPDF = () => {
    alert('Exportação para PDF iniciada.');
    setShowExportDropdown(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Padronizado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageHeader
          title="Gestão de Pagamento VT/VR"
          subtitle="Gerencie pagamentos de vale transporte e vale refeição"
          actions={
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaUsers className="w-4 h-4 text-slate-600 dark:text-slate-400 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.total}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaClock className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.pendentes}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Pendentes</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaCheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.pagos}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Pagos</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaMoneyBillWave className="w-4 h-4 text-primary-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(stats.totalPagamentos).replace('R$ ', 'R$ ')}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
              </div>
            </div>
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros e Controles */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
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
                aria-label="Buscar funcionário por nome"
              />
            </div>

            {/* Filtros de Status */}
            <div className="flex items-center gap-2">
              <FaIcons.FaFilter className="text-slate-500 w-4 h-4" />
              <div className="flex gap-2 text-sm">
                {(['todos', 'Pendente', 'Aprovado', 'Pago'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFiltroStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      filtroStatus === status
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {status === 'todos' ? 'Todos' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdown de Exportação */}
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(prev => !prev)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                title="Exportar dados"
              >
                <FaIcons.FaCloudDownloadAlt className="w-4 h-4" />
                <span>Exportar</span>
                <FaIcons.FaCaretDown className="w-3 h-3" />
              </button>

              {showExportDropdown && (
                <div className="absolute right-0 top-full z-10 mt-2 w-32 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-700">
                  <button
                    onClick={handleExportExcel}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-600 rounded-t-lg transition-colors"
                  >
                    <FaIcons.FaFileExcel className="mr-2 inline text-green-600" /> Excel
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-600 rounded-b-lg transition-colors"
                  >
                    <FaIcons.FaFilePdf className="mr-2 inline text-red-600" /> PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabela Principal */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Funcionários ({funcionariosFiltrados.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              {funcionariosFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <FaIcons.FaUsers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 mb-2">Nenhum funcionário encontrado</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Verifique os filtros aplicados</p>
                </div>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">Funcionário</th>
                      <th className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">Tipo</th>
                      <th className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">Vencimento</th>
                      <th className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">Status</th>
                      <th className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">Salário</th>
                      <th className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">VT/VR</th>
                      <th
                        className="cursor-pointer px-4 py-3 text-slate-800 hover:underline dark:text-slate-100 font-medium"
                        onClick={() => setOrdemAsc(!ordemAsc)}
                      >
                        Total Pago {ordemAsc ? '↑' : '↓'}
                      </th>
                      <th className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">Data Pagamento</th>
                      <th className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">Ações</th>
                      <th className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">Histórico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funcionariosFiltrados.map((emp, index) => {
                      const vencido = new Date(emp.vencimento) < new Date();
                      return (
                        <tr
                          key={emp.id}
                          className={`transition-colors ${
                            index % 2 === 0
                              ? 'bg-slate-50 dark:bg-slate-700/50'
                              : 'bg-white dark:bg-slate-800'
                          } hover:bg-primary-50 dark:hover:bg-primary-900/10`}
                        >
                          <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{emp.nome}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200">
                              {emp.tipo}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                            <span className={vencido ? 'font-bold text-red-600 dark:text-red-400' : ''}>
                              {formatDate(emp.vencimento)}
                            </span>
                            {vencido && (
                              <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1">
                                <FaIcons.FaExclamationTriangle className="w-3 h-3" /> Vencido
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusClasses(emp.statusPagamento)}`}>
                              {emp.statusPagamento === 'Pendente' && <FaIcons.FaClock className="mr-1 w-3 h-3" />}
                              {emp.statusPagamento === 'Aprovado' && <FaIcons.FaCheck className="mr-1 w-3 h-3" />}
                              {emp.statusPagamento === 'Pago' && <FaIcons.FaCheckCircle className="mr-1 w-3 h-3" />}
                              {emp.statusPagamento}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{formatCurrency(emp.salario)}</td>
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                            <div className="text-xs space-y-1">
                              <div>VT: {formatCurrency(emp.vtTotal)}</div>
                              <div>VR: {formatCurrency(emp.vrTotal)}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{formatCurrency(emp.salario + emp.vtTotal + emp.vrTotal)}</td>
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                            {emp.dataPagamento ? formatDate(emp.dataPagamento) : 
                              <span className="text-slate-400 dark:text-slate-500">---</span>
                            }
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {emp.statusPagamento === 'Pendente' && (
                                <button
                                  onClick={() => handleAprovarPagamento(emp.id, emp.nome)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                                  title="Aprovar pagamento"
                                >
                                  <FaIcons.FaCheck className="w-3 h-3" /> Aprovar
                                </button>
                              )}
                              {emp.statusPagamento === 'Aprovado' && (
                                <button
                                  onClick={() => handleEfetuarPagamento(emp.id, emp.nome)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                                  title="Efetuar pagamento"
                                >
                                  <FaIcons.FaMoneyBillWave className="w-3 h-3" /> Efetuar
                                </button>
                              )}
                              {emp.statusPagamento === 'Pago' && (
                                <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-green-500 text-white rounded-lg">
                                  <FaIcons.FaCheckCircle className="w-3 h-3" /> Pago
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={emp.historicoExcel}
                              download
                              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 hover:underline transition-colors"
                              title="Baixar histórico em Excel"
                            >
                              <FaIcons.FaFileExcel className="w-3 h-3" /> Excel
                            </a>
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

        {/* Rodapé com estatísticas */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Exibindo {funcionariosFiltrados.length} de {funcionarios.length} funcionários
          </p>
          {stats.vencidos > 0 && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              <FaIcons.FaExclamationTriangle className="w-3 h-3 inline mr-1" />
              {stats.vencidos} pagamento{stats.vencidos > 1 ? 's' : ''} vencido{stats.vencidos > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VTVRManagementPage;
