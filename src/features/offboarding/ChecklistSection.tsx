// frontend/src/features/offboarding/ChecklistSection.tsx
import React from 'react';
import {
  FaBan,
  FaCalendarAlt,
  FaCheckSquare,
  FaInfoCircle,
  FaTimesCircle,
  FaUserCog,
  FaClock,
  FaExclamationTriangle,
} from 'react-icons/fa';

import type { ChecklistArea, ChecklistItemExt, ChecklistPriority } from './offboarding';

/**
 * Seção de checklist por área, com inline edit melhorado
 * Design aprimorado para UI/UX e suporte completo ao modo escuro
 */

type Props = {
  title: string;
  area: ChecklistArea;
  items: ChecklistItemExt[];
  onToggle: (key: string) => void;
  onUpdateItem: (key: string, patch: Partial<ChecklistItemExt>) => void;
};

const priorities: ChecklistPriority[] = ['baixa', 'media', 'alta', 'critica'];

const priorityColors = {
  baixa: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  media: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  alta: 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300',
  critica: 'bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300',
};

const statusColors = {
  pendente: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  em_andamento: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  bloqueado: 'bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300',
  feito: 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300',
};

const areaColors = {
  RH: 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300',
  TI: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  Gestor: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  Comms: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
};

export const ChecklistSection: React.FC<Props> = ({ title, area, items, onToggle, onUpdateItem }) => {
  const areaItems = items.filter((it) => (it.area || 'RH') === area);
  const completedCount = areaItems.filter((it) => it.done).length;
  const totalCount = areaItems.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (areaItems.length === 0) {
    return (
      <section className="card-base p-6" aria-label={`Checklist ${title}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-3 h-3 rounded-full ${areaColors[area]?.split(' ')[0] || 'bg-slate-200'}`} />
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
        </div>
        <div className="text-center py-8">
          <div className="text-slate-400 dark:text-slate-500 mb-2">
            <FaCheckSquare size={24} className="mx-auto opacity-50" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum item para esta área</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card-base p-6" aria-label={`Checklist ${title}`}>
      {/* Header da seção */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${areaColors[area]?.split(' ')[0] || 'bg-slate-200'}`} />
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              areaColors[area] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {area}
          </span>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {completedCount}/{totalCount}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{Math.round(progress)}% concluído</div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mb-6">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lista de itens */}
      <ul className="space-y-4">
        {areaItems.map((it) => {
          const isOverdue = it.due && new Date(it.due) < new Date() && !it.done;
          const isDueSoon =
            it.due && !it.done && new Date(it.due) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

          // IDs exclusivos para labels/controles (acessibilidade)
          const ownerId = `owner-${it.key}`;
          const dueId = `due-${it.key}`;
          const priorityId = `priority-${it.key}`;
          const statusId = `status-${it.key}`;
          const blockReasonId = `block-reason-${it.key}`;

          return (
            <li
              key={it.key}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                it.done
                  ? 'border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/10'
                  : isOverdue
                  ? 'border-danger-200 bg-danger-50 dark:border-danger-800 dark:bg-danger-900/10'
                  : isDueSoon
                  ? 'border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/10'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              {/* Header do item */}
              <div className="flex items-start gap-4 mb-4">
                <label className="flex items-start gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-600 rounded transition-colors"
                    checked={!!it.done}
                    onChange={() => onToggle(it.key)}
                    aria-label={`Marcar ${it.label}`}
                  />
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium leading-relaxed ${
                        it.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {it.label}
                    </div>
                    {it.description && (
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{it.description}</p>
                    )}
                  </div>
                </label>

                {/* Badges de status */}
                <div className="flex items-center gap-2">
                  {isOverdue && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300">
                      <FaExclamationTriangle size={10} />
                      Atrasado
                    </span>
                  )}
                  {isDueSoon && !isOverdue && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300">
                      <FaClock size={10} />
                      Vence em breve
                    </span>
                  )}
                  {it.priority && (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        priorityColors[it.priority] || priorityColors.media
                      }`}
                    >
                      {it.priority}
                    </span>
                  )}
                </div>
              </div>

              {/* Alerta de bloqueio */}
              {it.status === 'bloqueado' && it.blockedReason && (
                <div className="mb-4 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
                  <div className="flex items-center gap-2 text-warning-700 dark:text-warning-300">
                    <FaInfoCircle size={14} />
                    <span className="text-sm font-medium">Item bloqueado</span>
                  </div>
                  <p className="mt-1 text-xs text-warning-600 dark:text-warning-400">{it.blockedReason}</p>
                </div>
              )}

              {/* Controles inline */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                {/* Responsável */}
                <div>
                  <label
                    htmlFor={ownerId}
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    <FaUserCog className="inline mr-1" size={10} />
                    Responsável
                  </label>
                  <select
                    id={ownerId}
                    className="input-base text-xs py-2"
                    value={it.owner ?? ''}
                    onChange={(e) => onUpdateItem(it.key, { owner: e.target.value })}
                  >
                    <option value="">Selecionar...</option>
                    <option value="RH">RH</option>
                    <option value="TI">TI</option>
                    <option value="Gestor">Gestor</option>
                    <option value="Comms">Comms</option>
                  </select>
                </div>

                {/* Prazo */}
                <div>
                  <label
                    htmlFor={dueId}
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    <FaCalendarAlt className="inline mr-1" size={10} />
                    Prazo
                  </label>
                  <input
                    id={dueId}
                    type="date"
                    className="input-base text-xs py-2"
                    value={it.due ?? ''}
                    onChange={(e) => onUpdateItem(it.key, { due: e.target.value })}
                  />
                </div>

                {/* Prioridade */}
                <div>
                  <label
                    htmlFor={priorityId}
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Prioridade
                  </label>
                  <select
                    id={priorityId}
                    className="input-base text-xs py-2"
                    value={it.priority ?? 'media'}
                    onChange={(e) =>
                      onUpdateItem(it.key, { priority: e.target.value as ChecklistItemExt['priority'] })
                    }
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p} className="capitalize">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor={statusId}
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id={statusId}
                    className="input-base text-xs py-2"
                    value={it.status ?? 'pendente'}
                    onChange={(e) =>
                      onUpdateItem(it.key, {
                        status: e.target.value as ChecklistItemExt['status'],
                        blockedReason: e.target.value === 'bloqueado' ? it.blockedReason ?? '' : '',
                      })
                    }
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="bloqueado">Bloqueado</option>
                    <option value="feito">Feito</option>
                  </select>
                </div>
              </div>

              {/* Campo de motivo do bloqueio */}
              {it.status === 'bloqueado' && (
                <div className="mt-3 flex items-center gap-2">
                  <label htmlFor={blockReasonId} className="sr-only">
                    Motivo do bloqueio
                  </label>
                  <input
                    id={blockReasonId}
                    className="input-base text-xs py-2 flex-1"
                    placeholder="Motivo do bloqueio..."
                    aria-label="Motivo do bloqueio"
                    value={it.blockedReason ?? ''}
                    onChange={(e) => onUpdateItem(it.key, { blockedReason: e.target.value })}
                  />
                  <button
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-danger-600 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                    onClick={() => onUpdateItem(it.key, { status: 'pendente', blockedReason: '' })}
                  >
                    <FaTimesCircle size={12} />
                    Desbloquear
                  </button>
                </div>
              )}

              {/* Status badges no final */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {it.done && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300">
                      <FaCheckSquare size={10} />
                      Concluído
                    </span>
                  )}
                  {it.status && it.status !== 'pendente' && !it.done && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[it.status] || statusColors.pendente
                      }`}
                    >
                      {it.status === 'bloqueado' && <FaBan size={10} />}
                      {it.status.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {it.due && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Prazo: {new Date(it.due).toLocaleDateString()}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Resumo da seção */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{totalCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success-600 dark:text-success-400">{completedCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Concluídos</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-600 dark:text-slate-400">
              {totalCount - completedCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Pendentes</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Progresso</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChecklistSection;
