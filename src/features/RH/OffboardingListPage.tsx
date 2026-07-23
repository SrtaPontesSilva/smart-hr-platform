// frontend/src/features/RH/OffboardingListPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaListUl,
  FaSearch,
  FaStopwatch,
  FaUserSlash,
  FaSave,
  FaStar,
  FaTrash,
  FaFileExport,
  FaSquare,
  FaCheckSquare,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import PageHeader from '../../layout/RH/PageHeader';
import useLocalStorage from '../../shared/hooks/useLocalStorage';
import { Button } from '../employee/DesignSystem';
import {
  loadOffboardings,
  upsertOffboarding,
  completeOffboarding,
  OffboardingRecord,
} from '../employee/offboarding';

type EmployeeLite = { id: number; nome: string; cargo?: string };
type StatusFilter = 'all' | 'rascunho' | 'em_andamento' | 'concluido' | 'arquivado';
type ChecklistArea = 'RH' | 'TI' | 'Gestor' | 'Comms';

const badgeClassByStatus: Record<string, string> = {
  rascunho: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  em_andamento: 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300',
  concluido: 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300',
  arquivado: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

function daysBetween(aISO: string, bISO: string) {
  const a = new Date(aISO).getTime();
  const b = new Date(bISO).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

type SavedView = {
  id: string;
  name: string;
  icon?: string;
  params: {
    statusFilter: StatusFilter;
    query: string;
    dateFrom: string;
    dateTo: string;
    lastDayFrom: string;
    lastDayTo: string;
    areaFilter: ChecklistArea | 'all';
  };
};

const OffboardingListPage: React.FC = () => {
  const navigate = useNavigate();

  const [employees] = useLocalStorage<EmployeeLite[]>('employees_full', []);
  const [items, setItems] = useState<OffboardingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== Filtros
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [lastDayFrom, setLastDayFrom] = useState<string>('');
  const [lastDayTo, setLastDayTo] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<ChecklistArea | 'all'>('all');
  const [query, setQuery] = useState<string>('');

  // ===== UI
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // ===== Minhas visões (filtros salvos)
  const [views, setViews] = useLocalStorage<SavedView[]>('offb_views', []);

  useEffect(() => {
    setItems(loadOffboardings());
    setTimeout(() => setLoading(false), 400);
  }, []);

  // Helpers
  const employeeById = useMemo(() => {
    const map = new Map<number, EmployeeLite>();
    employees.forEach((e) => map.set(e.id, e));
    return map;
  }, [employees]);

  const getEmployeeName = (id: number) => employeeById.get(id)?.nome || `#${id}`;
  const getEmployeeRole = (id: number) => employeeById.get(id)?.cargo || '—';

  // Aplicar filtros
  const filtered = useMemo(() => {
    return items.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;

      // criado em
      if (dateFrom) {
        const created = new Date(o.createdAt);
        if (created < new Date(dateFrom)) return false;
      }
      if (dateTo) {
        const created = new Date(o.createdAt);
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (created > end) return false;
      }

      // último dia
      if (lastDayFrom && o.lastWorkDay) {
        if (new Date(o.lastWorkDay) < new Date(lastDayFrom)) return false;
      }
      if (lastDayTo && o.lastWorkDay) {
        const end = new Date(lastDayTo);
        end.setHours(23, 59, 59, 999);
        if (new Date(o.lastWorkDay) > end) return false;
      }

      // filtro por área no checklist
      if (areaFilter !== 'all') {
        const hasArea = o.checklist.some((c: any) => (c.area || 'RH') === areaFilter);
        if (!hasArea) return false;
      }

      // busca textual
      if (query) {
        const name = getEmployeeName(o.employeeId).toLowerCase();
        const notes = (o.notes || '').toLowerCase();
        const q = query.toLowerCase();
        if (!name.includes(q) && !notes.includes(q)) return false;
      }
      return true;
    });
  }, [items, statusFilter, dateFrom, dateTo, lastDayFrom, lastDayTo, areaFilter, query, employeeById]);

  // KPIs
  const kpis = useMemo(() => {
    const total = filtered.length;
    const inProgress = filtered.filter((o) => o.status === 'em_andamento').length;
    const done = filtered.filter((o) => o.status === 'concluido').length;

    const nowISO = new Date().toISOString();
    const dueSoon = filtered.filter((o) => {
      try {
        const diff = daysBetween(nowISO, o.lastWorkDay);
        return diff >= 0 && diff <= 7;
      } catch {
        return false;
      }
    }).length;

    const leadTimes: number[] = filtered.map((o) => {
      const endISO = o.status === 'concluido' ? o.updatedAt : o.lastWorkDay;
      try {
        return Math.max(0, daysBetween(o.createdAt, endISO));
      } catch {
        return 0;
      }
    });
    const avgLeadTime =
      leadTimes.length > 0 ? Math.round(leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length) : 0;

    return { total, inProgress, done, dueSoon, avgLeadTime };
  }, [filtered]);

  const toggleExpand = (id: number) => setExpanded((curr) => (curr === id ? null : id));

  const toggleChecklistItem = (rec: OffboardingRecord, key: string) => {
    const updatedChecklist = rec.checklist.map((it: any) =>
      it.key === key ? { ...it, done: !it.done } : it,
    );
    const updated: OffboardingRecord = {
      ...rec,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString(),
    };
    upsertOffboarding(updated);
    setItems((prev) => prev.map((p) => (p.id === rec.id ? updated : p)));
  };

  const handleComplete = (rec: OffboardingRecord) => {
    const pending = rec.checklist.filter((c) => !c.done).length;
    if (pending > 0 && !confirm(`Há ${pending} pendência(s) no checklist. Deseja concluir assim mesmo?`)) {
      return;
    }
    completeOffboarding(rec.id);
    setItems(loadOffboardings());
    toast.success('Desligamento concluído!', { icon: '✅' });
  };

  const goToDetail = (recId: number) => navigate(`/rh/offboarding/${recId}`);

  // ===== Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId) return;
      if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        toggleExpand(selectedId);
      }
      if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        const rec = items.find((i) => i.id === selectedId);
        if (rec) handleComplete(rec);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, items]);

  // ===== Views
  const saveCurrentView = () => {
    const name = prompt('Nome da visão:');
    if (!name) return;
    const icon = prompt('Ícone (opcional, ex.: ⭐):') || undefined;
    const v: SavedView = {
      id: String(Date.now()),
      name,
      icon,
      params: { statusFilter, query, dateFrom, dateTo, lastDayFrom, lastDayTo, areaFilter },
    };
    const next = [v, ...views];
    setViews(next);
    toast.success('Visão salva!', { icon: '💾' });
  };

  const applyView = (v: SavedView) => {
    setStatusFilter(v.params.statusFilter);
    setQuery(v.params.query);
    setDateFrom(v.params.dateFrom);
    setDateTo(v.params.dateTo);
    setLastDayFrom(v.params.lastDayFrom);
    setLastDayTo(v.params.lastDayTo);
    setAreaFilter(v.params.areaFilter);
    toast.success(`Visão aplicada: ${v.name}`, { icon: v.icon || '👀' });
  };

  const deleteView = (id: string) => setViews((prev) => prev.filter((v) => v.id !== id));

  // ===== Mass actions
  const allSelected = selectedRows.length > 0 && selectedRows.length === filtered.length;
  const toggleSelectAll = () => {
    setSelectedRows(allSelected ? [] : filtered.map((o) => o.id));
  };
  const toggleRow = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const massComplete = () => {
    const toComplete = items.filter((o) => selectedRows.includes(o.id) && o.status !== 'concluido');
    toComplete.forEach((rec) => completeOffboarding(rec.id));
    setItems(loadOffboardings());
    setSelectedRows([]);
    toast.success('Concluídos em massa!', { icon: '✅' });
  };

  const massArchive = () => {
    const toArchive = items.filter((o) => selectedRows.includes(o.id));
    toArchive.forEach((rec) => {
      const updated: OffboardingRecord = { ...rec, status: 'arquivado', updatedAt: new Date().toISOString() };
      upsertOffboarding(updated);
    });
    setItems(loadOffboardings());
    setSelectedRows([]);
    toast.success('Arquivados!', { icon: '🗂️' });
  };

  const exportCSV = () => {
    const header = ['id', 'employeeId', 'nome', 'cargo', 'status', 'lastWorkDay', 'createdAt', 'updatedAt', 'pendencias'];
    const rows = filtered
      .filter((o) => selectedRows.includes(o.id))
      .map((o) => [
        o.id, o.employeeId, JSON.stringify(getEmployeeName(o.employeeId)), JSON.stringify(getEmployeeRole(o.employeeId)),
        o.status, o.lastWorkDay, o.createdAt, o.updatedAt, o.checklist.filter((c: any) => !c.done).length,
      ]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'offboardings.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exportado!', { icon: '📄' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Live region para toasts acessíveis */}
        <div aria-live="polite" className="sr-only" />

        {/* Header */}
        <PageHeader
          title="Desligamentos"
          subtitle="Gerencie processos de offboarding de colaboradores"
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilters((s) => !s)}
                icon={showFilters ? <FaEyeSlash /> : <FaEye />}
              >
                {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={saveCurrentView}
                icon={<FaSave />}
              >
                Salvar visão
              </Button>
            </div>
          }
        />

        {/* KPIs Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <button
            className="card-base p-4 text-left hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => setStatusFilter('all')}
            aria-label="Ver todos os desligamentos"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</div>
                <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{kpis.total}</div>
              </div>
              <div className="text-primary-500">
                <FaListUl size={20} />
              </div>
            </div>
          </button>

          <button
            className="card-base p-4 text-left hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => setStatusFilter('em_andamento')}
            aria-label="Ver desligamentos em andamento"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Em andamento</div>
                <div className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">{kpis.inProgress}</div>
              </div>
              <div className="text-warning-500">
                <FaStopwatch size={20} />
              </div>
            </div>
          </button>

          <button
            className="card-base p-4 text-left hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => setStatusFilter('concluido')}
            aria-label="Ver desligamentos concluídos"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Concluídos</div>
                <div className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{kpis.done}</div>
              </div>
              <div className="text-success-500">
                <FaCheck size={20} />
              </div>
            </div>
          </button>

          <div className="card-base p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Vencendo em 7d</div>
                <div className="mt-1 text-2xl font-bold text-danger-600 dark:text-danger-400">{kpis.dueSoon}</div>
              </div>
              <div className="text-danger-500">
                <FaStopwatch size={20} />
              </div>
            </div>
          </div>

          <div className="card-base p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Lead time médio</div>
                <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{kpis.avgLeadTime}d</div>
              </div>
              <div className="text-slate-400">
                <FaListUl size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Minhas visões */}
        {views.length > 0 && (
          <div className="card-base p-4 mb-6">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              <FaStar className="text-primary-500" />
              Minhas visões
            </div>
            <div className="flex flex-wrap gap-2">
              {views.map((v) => (
                <div key={v.id} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5">
                  <button
                    className="text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    onClick={() => applyView(v)}
                  >
                    {v.icon || '⭐'} {v.name}
                  </button>
                  <button
                    className="text-danger-600 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300 transition-colors"
                    aria-label="Excluir visão"
                    onClick={() => deleteView(v.id)}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        {showFilters && (
          <div className="card-base p-6 mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
              <div className="lg:col-span-2">
                <label htmlFor="offb-search" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    id="offb-search"
                    className="input-base pl-10"
                    placeholder="Nome ou observações..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="offb-status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  id="offb-status"
                  className="input-base"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                >
                  <option value="all">Todos</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="arquivado">Arquivado</option>
                </select>
              </div>

              <div>
                <label htmlFor="offb-created-from" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Criado de
                </label>
                <input
                  id="offb-created-from"
                  type="date"
                  className="input-base"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="offb-created-to" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Criado até
                </label>
                <input
                  id="offb-created-to"
                  type="date"
                  className="input-base"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="offb-lastday-from" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Último dia (de)
                </label>
                <input
                  id="offb-lastday-from"
                  type="date"
                  className="input-base"
                  value={lastDayFrom}
                  onChange={(e) => setLastDayFrom(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="offb-lastday-to" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Último dia (até)
                </label>
                <input
                  id="offb-lastday-to"
                  type="date"
                  className="input-base"
                  value={lastDayTo}
                  onChange={(e) => setLastDayTo(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDateFrom(''); setDateTo('');
                    setLastDayFrom(''); setLastDayTo('');
                    setStatusFilter('all'); setQuery(''); setAreaFilter('all');
                  }}
                  className="w-full"
                >
                  Limpar filtros
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar de ações em massa */}
        {selectedRows.length > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20 p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {selectedRows.length} selecionado(s)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={massComplete}>
                <FaCheck className="mr-1" /> Concluir
              </Button>
              <Button size="sm" variant="secondary" onClick={massArchive}>
                Arquivar
              </Button>
              <Button size="sm" variant="secondary" onClick={exportCSV} icon={<FaFileExport />}>
                Exportar CSV
              </Button>
            </div>
          </div>
        )}

        {/* Tabela */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 w-12">
                    <button
                      onClick={toggleSelectAll}
                      aria-label="Selecionar todos"
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      {allSelected ? <FaCheckSquare /> : <FaSquare />}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Funcionário
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Último dia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Pendências
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        <span className="ml-3 text-slate-500 dark:text-slate-400">Carregando...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="text-slate-500 dark:text-slate-400">
                        <FaUserSlash className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">Nenhum desligamento encontrado</p>
                        <p className="text-sm">Ajuste os filtros para ver mais resultados</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && filtered.map((o) => {
                  const pending = o.checklist.filter((c: any) => !c.done).length;
                  const isSelected = selectedRows.includes(o.id);

                  return (
                    <React.Fragment key={o.id}>
                      <tr
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                          selectedId === o.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                        }`}
                        tabIndex={0}
                        onClick={() => setSelectedId(o.id)}
                        onKeyUp={(e) => e.key === 'Enter' && toggleExpand(o.id)}
                        aria-selected={selectedId === o.id}
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(o.id);
                            }}
                            aria-label={isSelected ? 'Desmarcar linha' : 'Selecionar linha'}
                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                          >
                            {isSelected ? <FaCheckSquare /> : <FaSquare />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {getEmployeeName(o.employeeId)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {getEmployeeRole(o.employeeId)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {o.lastWorkDay || '—'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClassByStatus[o.status] || ''}`}>
                            {o.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {pending > 0 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300">
                                {pending}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300">
                                ✓
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(o.id);
                              }}
                              icon={expanded === o.id ? <FaChevronUp /> : <FaChevronDown />}
                              aria-expanded={expanded === o.id}
                              aria-label="Ver checklist"
                            >
                              Checklist
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                goToDetail(o.id);
                              }}
                              icon={<FaExternalLinkAlt />}
                            >
                              Detalhar
                            </Button>
                            {o.status !== 'concluido' && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleComplete(o);
                                }}
                                icon={<FaCheck />}
                              >
                                Concluir
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Linha expandida com checklist */}
                      {expanded === o.id && (
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                          <td colSpan={7} className="px-4 py-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div className="lg:col-span-2">
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                                  Checklist do Desligamento
                                </h4>
                                <div className="space-y-3">
                                  {o.checklist.map((it: any) => (
                                    <div key={it.key} className="card-base p-3">
                                      <div className="flex items-start justify-between gap-3">
                                        <label className="flex items-center gap-3 flex-1">
                                          <input
                                            type="checkbox"
                                            checked={!!it.done}
                                            onChange={() => toggleChecklistItem(o, it.key)}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                                          />
                                          <span className={`text-sm ${it.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {it.label}
                                          </span>
                                        </label>

                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                          {it.owner && <span>Resp: {it.owner}</span>}
                                          {it.due && <span>Prazo: {it.due}</span>}
                                          {it.priority && <span>Prior: {it.priority}</span>}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                                  Informações
                                </h4>
                                <div className="card-base p-4 space-y-3 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Criado em:</span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                      {new Date(o.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Último dia:</span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                      {o.lastWorkDay || '—'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Tipo:</span>
                                    <span className="text-slate-700 dark:text-slate-300 capitalize">
                                      {o.terminationType?.replace('_', ' ') || '—'}
                                    </span>
                                  </div>
                                  {o.notes && (
                                    <div>
                                      <span className="text-slate-500 block mb-1">Observações:</span>
                                      <span className="text-slate-700 dark:text-slate-300 text-xs">
                                        {o.notes}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffboardingListPage;
