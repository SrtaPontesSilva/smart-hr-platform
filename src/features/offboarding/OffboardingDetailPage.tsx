// frontend/src/features/offboarding/OffboardingDetailPage.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaClipboardList,
  FaCogs,
  FaIdBadge,
  FaPaperclip,
  FaSave,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
  FaBell,
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

import PageHeader from '../../layout/RH/PageHeader';
import useLocalStorage from '../../shared/hooks/useLocalStorage';
import { Button, Badge, Card, Alert } from '../employee/DesignSystem';
import { loadOffboardings, upsertOffboarding, OffboardingRecord } from '../employee/offboarding';

import AutomationPills from './AutomationPills';
import { ChecklistSection } from './ChecklistSection';
import type {
  ChecklistItemExt,
  ChecklistArea,
  IntegrationKey,
  IntegrationState,
  AuditEvent,
  OffboardingExtras,
} from './offboarding';
import Timeline from './Timeline';

/**
 * Página de detalhes do offboarding melhorada
 * UI/UX aprimorada com melhor organização visual e suporte ao modo escuro
 */

const AREAS: ChecklistArea[] = ['RH', 'TI', 'Gestor', 'Comms'];

type TabId = 'checklist' | 'automations' | 'auditoria';

const statusLabels = {
  rascunho: 'Rascunho',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  arquivado: 'Arquivado',
};

const stepLabels = [
  { id: 1, label: 'Planejamento', description: 'Definição inicial e preparação' },
  { id: 2, label: 'Documentação', description: 'Aspectos legais e documentais' },
  { id: 3, label: 'Transição', description: 'Transferência de responsabilidades' },
  { id: 4, label: 'Comunicação', description: 'Anúncios internos e externos' },
  { id: 5, label: 'Finalização', description: 'Encerramento do processo' },
];

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [off, setOff] = useState<(OffboardingRecord & OffboardingExtras) | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('checklist');
  const [saving, setSaving] = useState(false);
  const [loadingIntegration, setLoadingIntegration] = useState<IntegrationKey | null>(null);

  // Employees para foto/nome/cargo
  type EmployeeLite = { id: number; nome: string; cargo?: string; fotoUrl?: string };
  const [employees] = useLocalStorage<EmployeeLite[]>('employees_full', []);
  const employee = useMemo(() => employees.find((e) => e.id === Number(off?.employeeId)), [employees, off]);

  // Estados computados
  const checklist = (off?.checklist ?? []) as ChecklistItemExt[];
  const completedItems = checklist.filter((item) => item.done).length;
  const totalItems = checklist.length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const daysUntilLastDay = off?.lastWorkDay
    ? daysBetween(new Date().toISOString(), off.lastWorkDay)
    : null;

  const currentStep = useMemo(() => {
    if (off?.status === 'concluido') return 5;
    if (progress >= 80) return 4;
    if (progress >= 60) return 3;
    if (progress >= 40) return 2;
    if (progress >= 20) return 1;
    return 0;
  }, [progress, off?.status]);

  // Carregar registro
  useEffect(() => {
    const all = loadOffboardings();
    const found = all.find((o) => String(o.id) === id) as OffboardingRecord | undefined;
    if (!found) {
      toast.error('Desligamento não encontrado');
      navigate('/rh/offboarding');
      return;
    }

    const extras: OffboardingExtras = {
      auditTrail: [],
      integrationsSnapshot: {},
    };
    setOff({ ...(found as any), ...extras });
  }, [id, navigate]);

  // ===== Helpers de persistência + auditoria =====
  const pushAudit = useCallback((ev: Omit<AuditEvent, 'id' | 'at' | 'by'>) => {
    setOff((curr) => {
      if (!curr) return curr;
      const next: OffboardingRecord & OffboardingExtras = {
        ...curr,
        auditTrail: [
          ...(curr.auditTrail ?? []),
          { id: String(Date.now()), at: new Date().toISOString(), by: 'usuário', ...ev },
        ],
      };
      upsertOffboarding(next as OffboardingRecord);
      return next;
    });
  }, []);

  const patchItem = useCallback(
    (key: string, patch: Partial<ChecklistItemExt>) => {
      setOff((curr) => {
        if (!curr) return curr;
        const updatedList = (curr.checklist as ChecklistItemExt[]).map((it) =>
          it.key === key ? { ...it, ...patch } : it,
        );
        const next: OffboardingRecord & OffboardingExtras = {
          ...curr,
          checklist: updatedList,
          updatedAt: new Date().toISOString(),
        };
        upsertOffboarding(next as OffboardingRecord);
        return next;
      });
      pushAudit({ type: 'checklist', message: `Atualização no item: ${key}` });
    },
    [pushAudit],
  );

  const toggleItem = useCallback(
    (key: string) => {
      const item = checklist.find((i) => i.key === key);
      const newStatus = !item?.done;
      patchItem(key, {
        done: newStatus,
        status: newStatus ? 'feito' : 'pendente',
        log: [
          ...(item?.log ?? []),
          {
            action: newStatus ? 'marcou como concluído' : 'desmarcou',
            at: new Date().toISOString(),
            by: 'usuário',
          },
        ],
      });
    },
    [checklist, patchItem],
  );

  const handleSave = async () => {
    if (!off) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    upsertOffboarding({ ...(off as OffboardingRecord), updatedAt: new Date().toISOString() });
    setSaving(false);
    toast.success('Alterações salvas!', { icon: '💾' });
    pushAudit({ type: 'update', message: 'Dados do desligamento atualizados' });
  };

  // ===== Automations (mock) =====
  const [integrations, setIntegrations] = useState<Partial<Record<IntegrationKey, IntegrationState>>>({
    google: { key: 'google', connection: 'Desconectado' },
    ad: { key: 'ad', connection: 'Desconectado' },
    slack: { key: 'slack', connection: 'Desconectado' },
    teams: { key: 'teams', connection: 'Desconectado' },
    clickup: { key: 'clickup', connection: 'Desconectado' },
    trello: { key: 'trello', connection: 'Desconectado' },
    github: { key: 'github', connection: 'Desconectado' },
  });

  const simulateDelay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

  const handleConnectToggle = (key: IntegrationKey) => {
    setIntegrations((curr) => {
      const prev = curr[key];
      const nextConn = prev?.connection === 'Conectado' ? 'Desconectado' : 'Conectado';
      const next = { ...(curr || {}), [key]: { ...(prev as any), key, connection: nextConn } };
      localStorage.setItem('offb_integrations_state', JSON.stringify(next));
      return next;
    });
    pushAudit({
      type: 'automation',
      message: `Integração ${key} ${integrations[key]?.connection === 'Conectado' ? 'desconectada' : 'conectada'}`,
    });
  };

  const handleTest = async (key: IntegrationKey) => {
    setLoadingIntegration(key);
    await simulateDelay(500 + Math.random() * 800);
    const ok = Math.random() > 0.2;

    setIntegrations((curr) => {
      const prev = curr[key];
      const next = {
        ...(curr || {}),
        [key]: {
          ...(prev as any),
          key,
          lastTestAt: new Date().toISOString(),
          lastRunStatus: ok ? 'Ok' : 'Falha',
        },
      };
      localStorage.setItem('offb_integrations_state', JSON.stringify(next));
      return next;
    });

    setLoadingIntegration(null);
    pushAudit({ type: 'automation', message: `Teste de integração ${key}: ${ok ? 'Ok' : 'Falha'}` });
    toast[ok ? 'success' : 'error'](`Teste ${key}: ${ok ? 'Ok' : 'Falha'}`);
  };

  useEffect(() => {
    const saved = localStorage.getItem('offb_integrations_state');
    if (saved) setIntegrations(JSON.parse(saved));
  }, []);

  // Gerar lembrete
  const gerarLembrete = () => {
    const key = `lembrete_${Date.now()}`;
    const newItem: ChecklistItemExt = {
      key,
      label: 'Lembrete enviado (WhatsApp/Telegram)',
      area: 'Comms',
      priority: 'media',
      done: false,
      status: 'pendente',
      description: 'Lembrete de comunicação enviado via canais digitais',
    };

    setOff((curr) => {
      if (!curr) return curr;
      return {
        ...curr,
        checklist: [...curr.checklist, newItem],
        updatedAt: new Date().toISOString(),
      };
    });

    toast.success('Lembrete criado no checklist!', { icon: '🔔' });
    pushAudit({ type: 'automation', message: 'Lembrete de comunicação digital gerado' });
  };

  // ===== Render =====
  if (!off) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  const pending = checklist.filter((c) => !c.done).length;
  const urgentItems = checklist.filter((item) => {
    if (item.done) return false;
    if (!item.due) return false;
    const daysUntilDue = daysBetween(new Date().toISOString(), item.due);
    return daysUntilDue <= 1;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          title="Detalhes do Desligamento"
          subtitle={`Gerencie o processo de offboarding de ${employee?.nome || `Funcionário #${off.employeeId}`}`}
          actions={
            <div className="flex items-center gap-3">
              <Button size="sm" variant="secondary" onClick={() => navigate(-1)} icon={<FaArrowLeft />}>
                Voltar
              </Button>
              <Button size="sm" variant="primary" onClick={handleSave} loading={saving} icon={<FaSave />}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          }
        />

        {/* Alertas importantes */}
        {urgentItems > 0 && (
          <Alert variant="warning" className="mb-6" title="Itens urgentes">
            Há {urgentItems} item(ns) do checklist com prazo vencendo em até 1 dia.
          </Alert>
        )}

        {daysUntilLastDay !== null && daysUntilLastDay <= 7 && daysUntilLastDay >= 0 && (
          <Alert variant="info" className="mb-6" title="Último dia se aproxima">
            O último dia de trabalho é em {daysUntilLastDay} dia(s). Certifique-se de que todos os itens estão sendo finalizados.
          </Alert>
        )}

        {/* Header do colaborador */}
        <Card className="mb-6" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  {employee?.fotoUrl ? (
                    <img src={employee.fotoUrl} alt={`${employee.nome}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <FaUser size={24} />
                    </div>
                  )}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 ${
                    off.status === 'concluido'
                      ? 'bg-success-500'
                      : off.status === 'em_andamento'
                      ? 'bg-warning-500'
                      : 'bg-slate-400'
                  }`}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {employee?.nome || `Funcionário #${off.employeeId}`}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">{employee?.cargo || 'Cargo não informado'}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={off.status === 'concluido' ? 'success' : off.status === 'em_andamento' ? 'warning' : 'default'}>
                    {statusLabels[off.status]}
                  </Badge>
                  {off.terminationType && <Badge variant="info">{off.terminationType.replace('_', ' ')}</Badge>}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{progress}%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Progresso</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{pending}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Pendências</div>
                </div>
              </div>

              {off.lastWorkDay && (
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <FaCalendarAlt size={14} />
                  <span>Último dia: {new Date(off.lastWorkDay).toLocaleDateString()}</span>
                  {daysUntilLastDay !== null && (
                    <Badge variant={daysUntilLastDay <= 7 ? 'warning' : 'default'} size="sm">
                      {daysUntilLastDay <= 0 ? 'Vencido' : `${daysUntilLastDay}d`}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Barra de progresso geral */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progresso Geral</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {completedItems} de {totalItems} itens
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div className="bg-gradient-primary h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Stepper de fases */}
          <div className="grid grid-cols-5 gap-1">
            {stepLabels.map((step, idx) => {
              const isActive = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={step.id}
                  className={`relative p-3 rounded-lg text-center transition-all duration-300 ${
                    isActive
                      ? isCurrent
                        ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-300 dark:border-primary-700'
                        : 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div
                    className={`text-xs font-semibold mb-1 ${
                      isActive
                        ? isCurrent
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-success-700 dark:text-success-300'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-[10px] leading-tight ${
                      isActive ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.description}
                  </div>

                  {isActive && !isCurrent && (
                    <div className="absolute top-1 right-1">
                      <FaCheckCircle className="text-success-500 dark:text-success-400" size={12} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Tabs de navegação */}
        <div className="mb-6">
          {/* Removido role explícito para evitar warning jsx-a11y/no-noninteractive-element-to-interactive-role */}
          <nav className="flex space-x-1">
            {[
              { id: 'checklist', label: 'Checklist', icon: FaClipboardList, count: pending },
              { id: 'automations', label: 'Automações', icon: FaCogs },
              { id: 'auditoria', label: 'Auditoria', icon: FaIdBadge, count: off.auditTrail?.length || 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                onClick={() => setActiveTab(tab.id as TabId)}
                aria-pressed={activeTab === tab.id}
                type="button"
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <Badge size="sm" variant={tab.id === 'checklist' ? 'warning' : 'default'}>
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo das tabs */}
        <div role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {activeTab === 'checklist' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {AREAS.map((area) => (
                <ChecklistSection
                  key={area}
                  title={area}
                  area={area}
                  items={checklist}
                  onToggle={toggleItem}
                  onUpdateItem={patchItem}
                />
              ))}

              {/* Seção de evidências */}
              <Card className="lg:col-span-2" padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <FaPaperclip className="text-slate-400 dark:text-slate-500" />
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Evidências e Documentos</h4>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border-2 border-dashed border-slate-300 dark:border-slate-600">
                  <div className="text-center">
                    <FaPaperclip className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Anexe documentos e evidências dos itens do checklist
                    </p>
                    <Button size="sm" variant="secondary">
                      Fazer Upload
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'automations' && (
            <div className="space-y-6">
              <AutomationPills
                states={integrations}
                onConnectToggle={handleConnectToggle}
                onTest={handleTest}
                loading={loadingIntegration}
              />

              {/* Ações rápidas */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ações Rápidas</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Execute automações comuns para este desligamento
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button size="sm" variant="secondary" onClick={() => handleTest('google')} className="justify-start">
                    Revogar Google/AD
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleTest('slack')} className="justify-start">
                    Remover Slack/Teams
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleTest('clickup')} className="justify-start">
                    Remover Projetos
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={gerarLembrete}
                    icon={<FaBell />}
                    className="justify-start"
                  >
                    Gerar Lembrete
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'auditoria' && <Timeline events={off.auditTrail ?? []} />}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
