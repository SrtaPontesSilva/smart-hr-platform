// frontend/src/features/offboarding/offboarding.ts
/**
 * Tipos auxiliares para offboarding, mantendo compatibilidade com OffboardingRecord
 * do módulo ../employee/offboarding (não alterado).
 *
 * Estes tipos são opcionais e podem coexistir no objeto persistido em localStorage.
 */

export type ChecklistArea = 'RH' | 'TI' | 'Gestor' | 'Comms';

export type ChecklistPriority = 'baixa' | 'media' | 'alta' | 'critica';

export type ChecklistItemStatus = 'pendente' | 'em_andamento' | 'bloqueado' | 'feito';

export type AutomationConnection = 'Conectado' | 'Desconectado';
export type AutomationRunStatus = 'Ok' | 'Falha';

export type IntegrationKey = 'google' | 'ad' | 'slack' | 'teams' | 'clickup' | 'trello' | 'github';

/** Item de checklist estendido (campos opcionais, não quebram o contrato atual) */
export interface ChecklistItemExt {
  key: string;
  label: string;
  done?: boolean;

  // ===== Novos campos =====
  area?: ChecklistArea;
  description?: string;
  owner?: string;       // responsável (select)
  due?: string;         // YYYY-MM-DD
  priority?: ChecklistPriority;
  status?: ChecklistItemStatus; // visual do item
  blockedReason?: string;       // tooltip quando bloqueado
  dependencies?: string[];      // keys de outros itens
  evidenceUrl?: string | null;  // upload opcional (apenas metadado)
  automatable?: boolean;        // marca itens que aparecem na aba Automations
  requiresEvidence?: boolean;   // precisa de comprovante

  // log simplificado por item (auditoria pontual)
  log?: Array<{ by: string; at: string; action: string }>;
}

/** Evento de auditoria no detalhe */
export type AuditEventType = 'create' | 'update' | 'checklist' | 'automation';
export interface AuditEvent {
  id: string;
  type: AuditEventType;
  at: string;       // ISO
  by: string;       // exibido
  message: string;  // resumo
  meta?: Record<string, unknown>;
}

/** Estados de integrações (config page / aba automations) */
export interface IntegrationState {
  key: IntegrationKey;
  connection: AutomationConnection;
  lastTestAt?: string;
  lastRunStatus?: AutomationRunStatus;
  mappedTargets?: string[]; // grupos/canais/projetos mapeados para revogação
}

/** Extensão não disruptiva que pode ser mesclada em OffboardingRecord */
export interface OffboardingExtras {
  auditTrail?: AuditEvent[];
  // snapshot dos estados das integrações quando o desligamento foi criado
  integrationsSnapshot?: Partial<Record<IntegrationKey, IntegrationState>>;
}

/** View (filtros salvos) na lista */
export interface OffboardingSavedView {
  id: string;
  name: string;
  icon?: string; // ex.: "⭐", "🧭"
  params: {
    status?: string;
    q?: string;
    createdFrom?: string;
    createdTo?: string;
    lastDayFrom?: string;
    lastDayTo?: string;
    area?: ChecklistArea | 'all';
  };
}
