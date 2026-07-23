import React, { useState, useMemo, useEffect } from 'react';
import { 
  FaFilePdf, FaFileExcel, FaFilter, FaUsers, FaMoneyBillWave,
  FaExclamationTriangle, FaCheckCircle, FaEraser, FaSearch, FaTimes,
  FaEye, FaEdit, FaChevronLeft, FaChevronRight, FaUser, FaCalendarAlt
} from 'react-icons/fa';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

import PageHeader from '../../layout/RH/PageHeader';

// Interfaces
interface PaymentHistory {
  id: number;
  funcionario: string;
  tipo: 'VT' | 'VR' | 'Reembolso';
  valor: number;
  data: string;
  mes: string;
}

interface FaltasHistory {
  id: number;
  funcionario: string;
  dataFalta: string;
  justificativa?: string;
  mes: string;
}

interface FilterState {
  funcionario: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
  justificativa: string;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'payment' | 'absence';
  data: PaymentHistory | FaltasHistory | null;
}

// Modal de Detalhes Melhorado
const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, type, data }) => {
  if (!isOpen || !data) return null;

  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Fechar modal"
        onKeyDown={handleBackdropKeyDown}
      />
      <div className="relative w-full max-w-2xl card-base animate-scale-in">
        {/* Header do Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-primary-100 dark:bg-primary-900/30 p-2.5">
              <FaUser className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {type === 'payment' ? 'Detalhes do Pagamento' : 'Detalhes da Falta'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {(data as any).funcionario}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-base p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Fechar modal"
            type="button"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Conteúdo do Modal */}
        <div className="space-y-6 p-6">
          {type === 'payment' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  ID do Pagamento
                </label>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">#{data.id}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tipo
                </label>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                  (data as PaymentHistory).tipo === 'VT' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  (data as PaymentHistory).tipo === 'VR' 
                    ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300' :
                    'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                }`}>
                  {(data as PaymentHistory).tipo}
                </span>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Valor
                </label>
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                  R$ {(data as PaymentHistory).valor.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Data
                </label>
                <p className="text-slate-900 dark:text-slate-100 flex items-center">
                  <FaCalendarAlt className="mr-2 text-slate-400" />
                  {(data as PaymentHistory).data}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    ID da Falta
                  </label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">#{data.id}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Data da Falta
                  </label>
                  <p className="text-slate-900 dark:text-slate-100 flex items-center">
                    <FaCalendarAlt className="mr-2 text-slate-400" />
                    {(data as FaltasHistory).dataFalta}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Justificativa
                </label>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-900 dark:text-slate-100">
                    {(data as FaltasHistory).justificativa || (
                      <span className="italic text-slate-400">Não informado</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </label>
                {(data as FaltasHistory).justificativa && (data as FaltasHistory).justificativa!.trim() !== '' ? (
                  <span className="inline-flex items-center bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 px-3 py-2 rounded-lg text-sm font-semibold">
                    <FaCheckCircle className="mr-2" />
                    Justificativa Apresentada
                  </span>
                ) : (
                  <span className="inline-flex items-center bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-300 px-3 py-2 rounded-lg text-sm font-semibold">
                    <FaExclamationTriangle className="mr-2" />
                    Pendente de Justificativa
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer do Modal */}
        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 p-6">
          <button
            onClick={onClose}
            className="btn-base btn-secondary px-4 py-2"
            type="button"
          >
            Fechar
          </button>
          <button className="btn-base btn-primary px-4 py-2" type="button">
            <FaEdit className="mr-2" />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente KPI Card Melhorado
const KPICard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  tooltip: string;
  trend?: { value: number; isPositive: boolean };
  onClick?: () => void;
}> = ({ title, value, icon, color, tooltip, trend, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <button
      type="button"
      className={`relative card-base p-6 hover-lift cursor-pointer text-left group ${color}`}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      aria-label={`Abrir ${title}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {value}
          </p>
          {trend && (
            <div className={`flex items-center text-sm ${
              trend.isPositive 
                ? 'text-success-600 dark:text-success-400' 
                : 'text-danger-600 dark:text-danger-400'
            }`}>
              {trend.isPositive ? <HiTrendingUp className="mr-1" /> : <HiTrendingDown className="mr-1" />}
              {trend.value}% vs mês anterior
            </div>
          )}
        </div>
        <div className="text-3xl opacity-70 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-lg bg-slate-900 dark:bg-slate-100 px-3 py-2 text-xs text-white dark:text-slate-900 shadow-lg">
          {tooltip}
          <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-4 border-transparent border-t-slate-900 dark:border-t-slate-100"></div>
        </div>
      )}
    </button>
  );
};

const MonitoringReportsPage: React.FC = () => {
  // Estados principais
  const [activeTab, setActiveTab] = useState<'pagamentos' | 'faltas'>('pagamentos');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{type: 'payment' | 'absence', data: any} | null>(null);
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filtros com localStorage
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('monitoring_filters');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      funcionario: '',
      tipo: '',
      dataInicio: '',
      dataFim: '',
      justificativa: ''
    };
  });

  // Persistir filtros no localStorage
  useEffect(() => {
    localStorage.setItem('monitoring_filters', JSON.stringify(filters));
  }, [filters]);

  // Dados expandidos
  const [pagamentos] = useState<PaymentHistory[]>([
    { id: 1, funcionario: 'Ana Silva', tipo: 'VT', valor: 200, data: '15/01/2025', mes: '2025-01' },
    { id: 2, funcionario: 'Carlos Santos', tipo: 'VR', valor: 350, data: '15/01/2025', mes: '2025-01' },
    { id: 3, funcionario: 'Maria Oliveira', tipo: 'Reembolso', valor: 150, data: '20/01/2025', mes: '2025-01' },
    { id: 4, funcionario: 'João Costa', tipo: 'VT', valor: 180, data: '22/01/2025', mes: '2025-01' },
    { id: 5, funcionario: 'Ana Silva', tipo: 'VR', valor: 320, data: '25/01/2025', mes: '2025-01' },
    { id: 6, funcionario: 'Pedro Lima', tipo: 'Reembolso', valor: 280, data: '28/01/2025', mes: '2025-01' },
    { id: 7, funcionario: 'Lucia Mendes', tipo: 'VT', valor: 200, data: '30/01/2025', mes: '2025-01' },
    { id: 8, funcionario: 'Roberto Alves', tipo: 'VR', valor: 400, data: '02/02/2025', mes: '2025-02' },
    { id: 9, funcionario: 'Ana Silva', tipo: 'VT', valor: 220, data: '05/02/2025', mes: '2025-02' },
    { id: 10, funcionario: 'Carlos Santos', tipo: 'VR', valor: 380, data: '08/02/2025', mes: '2025-02' },
    { id: 11, funcionario: 'Maria Oliveira', tipo: 'Reembolso', valor: 180, data: '12/02/2025', mes: '2025-02' },
    { id: 12, funcionario: 'João Costa', tipo: 'VT', valor: 200, data: '15/02/2025', mes: '2025-02' }
  ]);

  const [faltas] = useState<FaltasHistory[]>([
    { id: 1, funcionario: 'Ana Silva', dataFalta: '12/01/2025', justificativa: 'Atestado Médico', mes: '2025-01' },
    { id: 2, funcionario: 'João Costa', dataFalta: '15/01/2025', justificativa: 'Consulta Médica', mes: '2025-01' },
    { id: 3, funcionario: 'Carlos Santos', dataFalta: '18/01/2025', justificativa: '', mes: '2025-01' },
    { id: 4, funcionario: 'Maria Oliveira', dataFalta: '22/01/2025', justificativa: 'Luto', mes: '2025-01' },
    { id: 5, funcionario: 'Pedro Lima', dataFalta: '25/01/2025', justificativa: '', mes: '2025-01' },
    { id: 6, funcionario: 'Ana Silva', dataFalta: '28/01/2025', justificativa: 'Problema Familiar', mes: '2025-01' },
    { id: 7, funcionario: 'Roberto Alves', dataFalta: '02/02/2025', justificativa: '', mes: '2025-02' },
    { id: 8, funcionario: 'Lucia Mendes', dataFalta: '08/02/2025', justificativa: 'Atestado Médico', mes: '2025-02' }
  ]);

  // Cálculos dos KPIs com tendências
  const kpis = useMemo(() => {
    const totalPagamentos = pagamentos.reduce((acc, p) => acc + p.valor, 0);
    const funcionariosUnicos = new Set(pagamentos.map(p => p.funcionario)).size;
    const mediaPorFuncionario = funcionariosUnicos > 0 ? totalPagamentos / funcionariosUnicos : 0;
    const totalFaltas = faltas.length;
    const faltasComJustificativa = faltas.filter(f => f.justificativa && f.justificativa.trim() !== '').length;
    const percentualJustificadas = totalFaltas > 0 ? (faltasComJustificativa / totalFaltas) * 100 : 0;

    // Cálculos de tendência
    const mesAtual = '2025-02';
    const mesAnterior = '2025-01';
    
    const pagamentosMesAtual = pagamentos.filter(p => p.mes === mesAtual).reduce((acc, p) => acc + p.valor, 0);
    const pagamentosMesAnterior = pagamentos.filter(p => p.mes === mesAnterior).reduce((acc, p) => acc + p.valor, 0);
    const trendPagamentos = pagamentosMesAnterior > 0 ? ((pagamentosMesAtual - pagamentosMesAnterior) / pagamentosMesAnterior) * 100 : 0;

    const faltasMesAtual = faltas.filter(f => f.mes === mesAtual).length;
    const faltasMesAnterior = faltas.filter(f => f.mes === mesAnterior).length;
    const trendFaltas = faltasMesAnterior > 0 ? ((faltasMesAtual - faltasMesAnterior) / faltasMesAnterior) * 100 : 0;

    return {
      totalPagamentos,
      mediaPorFuncionario,
      totalFaltas,
      percentualJustificadas,
      trends: {
        pagamentos: { value: Math.abs(trendPagamentos), isPositive: trendPagamentos >= 0 },
        faltas: { value: Math.abs(trendFaltas), isPositive: trendFaltas < 0 }
      }
    };
  }, [pagamentos, faltas]);

  // Dados para gráficos
  const chartData = useMemo(() => {
    const paymentsByType = pagamentos.reduce((acc, p) => {
      acc[p.tipo] = (acc[p.tipo] || 0) + p.valor;
      return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(paymentsByType).map(([tipo, valor]) => ({
      tipo,
      valor
    }));

    const monthlyData = pagamentos.reduce((acc, p) => {
      const monthKey = p.mes;
      if (!acc[monthKey]) {
        acc[monthKey] = { mes: monthKey, VT: 0, VR: 0, Reembolso: 0, total: 0 };
      }
      acc[monthKey][p.tipo] += p.valor;
      acc[monthKey].total += p.valor;
      return acc;
    }, {} as Record<string, any>);

    const lineData = Object.values(monthlyData).sort((a, b) => a.mes.localeCompare(b.mes));

    const justificativaCount = faltas.reduce((acc, f) => {
      const key = f.justificativa && f.justificativa.trim() !== '' ? 'Com Justificativa' : 'Sem Justificativa';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(justificativaCount).map(([name, value]) => ({
      name,
      value
    }));

    return { barData, lineData, pieData };
  }, [pagamentos, faltas]);

  // Filtros aplicados
  const filteredData = useMemo(() => {
    let filteredPayments = pagamentos;
    let filteredAbsences = faltas;

    if (filters.funcionario) {
      filteredPayments = filteredPayments.filter(p => 
        p.funcionario.toLowerCase().includes(filters.funcionario.toLowerCase())
      );
      filteredAbsences = filteredAbsences.filter(f => 
        f.funcionario.toLowerCase().includes(filters.funcionario.toLowerCase())
      );
    }

    if (filters.tipo) {
      filteredPayments = filteredPayments.filter(p => p.tipo === filters.tipo);
    }

    if (filters.dataInicio) {
      const dataInicio = new Date(filters.dataInicio.split('/').reverse().join('-'));
      filteredPayments = filteredPayments.filter(p => {
        const dataPagamento = new Date(p.data.split('/').reverse().join('-'));
        return dataPagamento >= dataInicio;
      });
      filteredAbsences = filteredAbsences.filter(f => {
        const dataFalta = new Date(f.dataFalta.split('/').reverse().join('-'));
        return dataFalta >= dataInicio;
      });
    }

    return { payments: filteredPayments, absences: filteredAbsences };
  }, [pagamentos, faltas, filters]);

  // Paginação
  const paginatedData = useMemo(() => {
    const data = activeTab === 'pagamentos' ? filteredData.payments : filteredData.absences;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: data.slice(startIndex, endIndex),
      totalPages: Math.ceil(data.length / itemsPerPage),
      totalItems: data.length
    };
  }, [filteredData, activeTab, currentPage, itemsPerPage]);

  // Handlers
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      funcionario: '',
      tipo: '',
      dataInicio: '',
      dataFim: '',
      justificativa: ''
    });
    setCurrentPage(1);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    const dataToExport = activeTab === 'pagamentos' ? filteredData.payments : filteredData.absences;
    console.log(`Exportando ${dataToExport.length} registros em ${format.toUpperCase()}...`, dataToExport);
  };

  const handleKPIClick = (type: string) => {
    switch (type) {
      case 'payments':
        setActiveTab('pagamentos');
        break;
      case 'absences':
        setActiveTab('faltas');
        break;
    }
  };

  const colors = ['#5E3BFF', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageHeader
          title="Monitoramento e Relatórios"
          subtitle="Acompanhe pagamentos, faltas e exporte relatórios com facilidade"
          variant="prominent"
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExport('pdf')}
                className="btn-base bg-danger-600 hover:bg-danger-700 text-white px-4 py-2 transition-colors"
                aria-label="Exportar PDF com dados filtrados"
                type="button"
              >
                <FaFilePdf className="mr-2" />
                PDF ({paginatedData.totalItems})
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="btn-base bg-success-600 hover:bg-success-700 text-white px-4 py-2 transition-colors"
                aria-label="Exportar Excel com dados filtrados"
                type="button"
              >
                <FaFileExcel className="mr-2" />
                Excel ({paginatedData.totalItems})
              </button>
            </div>
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* KPI Dashboard */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Pagamentos"
            value={`R$ ${kpis.totalPagamentos.toLocaleString('pt-BR')}`}
            icon={<FaMoneyBillWave className="text-primary-500" />}
            color="border-l-4 border-primary-500"
            tooltip="Inclui VT, VR e reembolsos do período filtrado"
            trend={kpis.trends.pagamentos}
            onClick={() => handleKPIClick('payments')}
          />

          <KPICard
            title="Média por Funcionário"
            value={`R$ ${kpis.mediaPorFuncionario.toLocaleString('pt-BR')}`}
            icon={<FaUsers className="text-success-500" />}
            color="border-l-4 border-success-500"
            tooltip="Valor médio de pagamentos por colaborador"
            onClick={() => handleKPIClick('payments')}
          />

          <KPICard
            title="Total de Faltas"
            value={kpis.totalFaltas.toString()}
            icon={<FaExclamationTriangle className="text-warning-500" />}
            color="border-l-4 border-warning-500"
            tooltip="Número total de ausências registradas"
            trend={kpis.trends.faltas}
            onClick={() => handleKPIClick('absences')}
          />

          <KPICard
            title="% Justificativas"
            value={`${kpis.percentualJustificadas.toFixed(1)}%`}
            icon={<FaCheckCircle className="text-purple-500" />}
            color="border-l-4 border-purple-500"
            tooltip="Percentual de faltas com justificativa apresentada"
            onClick={() => handleKPIClick('absences')}
          />
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Bar Chart */}
          <div className="card-base p-6">
            <h3 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
              Pagamentos por Tipo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="tipo" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip 
                  formatter={(value) => [`R$ ${value}`, 'Valor']}
                  contentStyle={{
                    backgroundColor: 'rgb(30 41 59)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="valor" fill="#5E3BFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="card-base p-6">
            <h3 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
              Evolução Mensal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="mes" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip 
                  formatter={(value) => [`R$ ${value}`, 'Valor']}
                  contentStyle={{
                    backgroundColor: 'rgb(30 41 59)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#5E3BFF" 
                  strokeWidth={3}
                  dot={{ fill: '#5E3BFF', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#5E3BFF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="card-base p-6">
            <h3 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
              Status das Justificativas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry: { name?: string; percent?: number }) => {
                    const name = entry.name ?? '';
                    const percent = entry.percent !== undefined ? (entry.percent * 100).toFixed(0) : '0';
                    return `${name} ${percent}%`;
                  }}
                >
                  {chartData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgb(30 41 59)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 card-base p-6">
          <div className="mb-4 flex flex-col items-center justify-between gap-4 lg:flex-row">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-base btn-secondary px-4 py-2"
                aria-label="Alternar filtros"
                type="button"
              >
                <FaFilter className="mr-2" />
                Filtros
                {(filters.funcionario || filters.tipo || filters.dataInicio) && (
                  <span className="ml-2 rounded-full bg-primary-500 px-2 py-0.5 text-xs text-white">
                    Ativo
                  </span>
                )}
              </button>
              {(filters.funcionario || filters.tipo || filters.dataInicio) && (
                <button
                  onClick={clearFilters}
                  className="btn-base bg-danger-100 hover:bg-danger-200 text-danger-700 dark:bg-danger-900/30 dark:hover:bg-danger-900/50 dark:text-danger-300 px-3 py-2 text-sm"
                  aria-label="Limpar filtros"
                  type="button"
                >
                  <FaEraser className="mr-1" />
                  Limpar
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 gap-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="funcionario" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Funcionário
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-slate-400" />
                  <input
                    id="funcionario"
                    type="text"
                    placeholder="Buscar funcionário..."
                    value={filters.funcionario}
                    onChange={(e) => handleFilterChange('funcionario', e.target.value)}
                    className="input-base pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tipo" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tipo de Pagamento
                </label>
                <select
                  id="tipo"
                  value={filters.tipo}
                  onChange={(e) => handleFilterChange('tipo', e.target.value)}
                  className="input-base"
                >
                  <option value="">Todos os tipos</option>
                  <option value="VT">Vale Transporte</option>
                  <option value="VR">Vale Refeição</option>
                  <option value="Reembolso">Reembolso</option>
                </select>
              </div>

              <div>
                <label htmlFor="dataInicio" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Data Início
                </label>
                <input
                  id="dataInicio"
                  type="date"
                  value={filters.dataInicio}
                  onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
                  className="input-base"
                />
              </div>

              <div>
                <label htmlFor="dataFim" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Data Fim
                </label>
                <input
                  id="dataFim"
                  type="date"
                  value={filters.dataFim}
                  onChange={(e) => handleFilterChange('dataFim', e.target.value)}
                  className="input-base"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tabs e Tabela */}
        <div className="card-base overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {setActiveTab('pagamentos'); setCurrentPage(1);}}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'pagamentos'
                  ? 'border-b-2 border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
              type="button"
            >
              <FaMoneyBillWave className="mr-2 inline" />
              Pagamentos ({filteredData.payments.length})
            </button>
            <button
              onClick={() => {setActiveTab('faltas'); setCurrentPage(1);}}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'faltas'
                  ? 'border-b-2 border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
              type="button"
            >
              <FaExclamationTriangle className="mr-2 inline" />
              Faltas ({filteredData.absences.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'pagamentos' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Funcionário</th>
                      <th className="px-6 py-3">Tipo</th>
                      <th className="px-6 py-3">Valor</th>
                      <th className="px-6 py-3">Data</th>
                      <th className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.items.map((payment: any) => (
                      <tr key={payment.id} className="border-b border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">#{payment.id}</td>
                        <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{payment.funcionario}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            payment.tipo === 'VT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            payment.tipo === 'VR' ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300' :
                            'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
                          }`}>
                            {payment.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-success-600 dark:text-success-400">
                          R$ {payment.valor.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{payment.data}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedItem({type: 'payment', data: payment})}
                              className="p-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                              aria-label={`Ver detalhes do pagamento ${payment.id}`}
                              type="button"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="p-1 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                              aria-label={`Editar pagamento ${payment.id}`}
                              type="button"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Funcionário</th>
                      <th className="px-6 py-3">Data da Falta</th>
                      <th className="px-6 py-3">Justificativa</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.items.map((absence: any) => (
                      <tr key={absence.id} className="border-b border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">#{absence.id}</td>
                        <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{absence.funcionario}</td>
                        <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{absence.dataFalta}</td>
                        <td className="px-6 py-4">
                          {absence.justificativa || (
                            <span className="italic text-slate-400">Não informado</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {absence.justificativa && absence.justificativa.trim() !== '' ? (
                            <span className="rounded-full bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 px-2 py-1 text-xs font-semibold">
                              Justificada
                            </span>
                          ) : (
                            <span className="rounded-full bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-300 px-2 py-1 text-xs font-semibold">
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedItem({type: 'absence', data: absence})}
                              className="p-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                              aria-label={`Ver detalhes da falta ${absence.id}`}
                              type="button"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="p-1 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                              aria-label={`Editar falta ${absence.id}`}
                              type="button"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {paginatedData.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-lg">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, paginatedData.totalItems)} de {paginatedData.totalItems} registros
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn-base btn-secondary px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Página anterior"
                    type="button"
                  >
                    <FaChevronLeft className="mr-1" />
                    Anterior
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, paginatedData.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`btn-base px-3 py-2 text-sm font-medium ${
                            currentPage === page
                              ? 'btn-primary'
                              : 'btn-secondary'
                          }`}
                          aria-label={`Ir para página ${page}`}
                          type="button"
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginatedData.totalPages))}
                    disabled={currentPage === paginatedData.totalPages}
                    className="btn-base btn-secondary px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Próxima página"
                    type="button"
                  >
                    Próxima
                    <FaChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <DetailModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        type={selectedItem?.type || 'payment'}
        data={selectedItem?.data || null}
      />
    </div>
  );
};

export default MonitoringReportsPage;