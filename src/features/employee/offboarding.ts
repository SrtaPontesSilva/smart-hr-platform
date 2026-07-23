// frontend/src/features/employee/offboarding.ts
// Tipos e helpers de storage para o fluxo de desligamento (offboarding)

export type OffboardingStatus = 'rascunho' | 'em_andamento' | 'concluido' | 'arquivado';
export type TerminationType = 'pedido' | 'sem_justa_causa' | 'término' | 'acordo' | 'outra';
export type NoticeType = 'trabalhado' | 'indenizado' | 'nao_aplica';

export interface OffboardingListPageItem {
  key: string;
  label: string;
  owner?: string;
  done?: boolean;
  due?: string; // YYYY-MM-DD
}

export interface OffboardingRecord {
  id: number; // Date.now()
  employeeId: number;
  lastWorkDay: string;            // YYYY-MM-DD
  terminationType: TerminationType;
  noticeType: NoticeType;
  reasonCode?: string;
  notes?: string;
  status: OffboardingStatus;
  checklist: OffboardingListPageItem[];
  createdAt: string;              // ISO
  updatedAt: string;              // ISO
}

const OFFBOARD_KEY = 'offboardings';

export const loadOffboardings = (): OffboardingRecord[] => {
  try {
    return JSON.parse(localStorage.getItem(OFFBOARD_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveOffboardings = (list: OffboardingRecord[]) => {
  localStorage.setItem(OFFBOARD_KEY, JSON.stringify(list));
};

export const getOffboardingForEmployee = (employeeId: number): OffboardingRecord | undefined => {
  return loadOffboardings().find(
    (o) => o.employeeId === employeeId && (o.status === 'rascunho' || o.status === 'em_andamento'),
  );
};

export const upsertOffboarding = (rec: OffboardingRecord) => {
  const list = loadOffboardings();
  const idx = list.findIndex((o) => o.id === rec.id);
  if (idx >= 0) list[idx] = rec;
  else list.unshift(rec);
  saveOffboardings(list);
};

export const completeOffboarding = (id: number) => {
  const list = loadOffboardings();
  const idx = list.findIndex((o) => o.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], status: 'concluido', updatedAt: new Date().toISOString() };
    saveOffboardings(list);
  }
};

export const defaultChecklist: OffboardingListPageItem[] = [
  { key: 'devolucao_ativos', label: 'Devolução de notebook/crachá' },
  { key: 'encerrar_acessos', label: 'Encerrar acessos (e-mail, AD, SaaS)' },
  { key: 'docs_rescisao', label: 'Gerar e coletar documentos de rescisão' },
];
