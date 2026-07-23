// frontend/src/features/offboarding/AutomationPills.tsx
import React from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaLink,
  FaPlug,
  FaUnlink,
  FaSpinner,
  FaCloud,
  FaUsers,
  FaCog,
  FaCode,
} from 'react-icons/fa';

import { Button } from '../employee/DesignSystem';

import type { IntegrationKey, IntegrationState } from './offboarding';

/**
 * Pills de integração melhorados com UI/UX aprimorada
 * Suporte completo ao modo escuro e feedback visual melhor
 */
type Props = {
  states: Partial<Record<IntegrationKey, IntegrationState>>;
  onConnectToggle: (key: IntegrationKey) => void;
  onTest: (key: IntegrationKey) => Promise<void>;
  compact?: boolean;
  loading?: IntegrationKey | null;
};

const integrationConfig: Record<
  IntegrationKey,
  {
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    category: 'auth' | 'communication' | 'productivity' | 'development';
  }
> = {
  google: {
    label: 'Google Workspace',
    description: 'Gmail, Drive, Calendar',
    icon: <FaCloud size={16} />,
    color: 'text-blue-600 dark:text-blue-400',
    category: 'auth',
  },
  ad: {
    label: 'Active Directory',
    description: 'Autenticação corporativa',
    icon: <FaCog size={16} />,
    color: 'text-green-600 dark:text-green-400',
    category: 'auth',
  },
  slack: {
    label: 'Slack',
    description: 'Comunicação da equipe',
    icon: <FaUsers size={16} />,
    color: 'text-purple-600 dark:text-purple-400',
    category: 'communication',
  },
  teams: {
    label: 'Microsoft Teams',
    description: 'Colaboração e reuniões',
    icon: <FaUsers size={16} />,
    color: 'text-blue-600 dark:text-blue-400',
    category: 'communication',
  },
  clickup: {
    label: 'ClickUp',
    description: 'Gestão de projetos',
    icon: <FaCog size={16} />,
    color: 'text-pink-600 dark:text-pink-400',
    category: 'productivity',
  },
  trello: {
    label: 'Trello',
    description: 'Kanban boards',
    icon: <FaCog size={16} />,
    color: 'text-blue-600 dark:text-blue-400',
    category: 'productivity',
  },
  github: {
    label: 'GitHub',
    description: 'Repositórios de código',
    icon: <FaCode size={16} />,
    color: 'text-gray-600 dark:text-gray-400',
    category: 'development',
  },
};

const categoryLabels = {
  auth: 'Autenticação',
  communication: 'Comunicação',
  productivity: 'Produtividade',
  development: 'Desenvolvimento',
};

export const AutomationPills: React.FC<Props> = ({
  states,
  onConnectToggle,
  onTest,
  compact = false,
  loading = null,
}) => {
  const keys = Object.keys(integrationConfig) as IntegrationKey[];

  // Agrupar por categoria
  const groupedIntegrations = keys.reduce((acc, key) => {
    const category = integrationConfig[key].category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(key);
    return acc;
  }, {} as Record<string, IntegrationKey[]>);

  const handleTest = async (key: IntegrationKey) => {
    try {
      await onTest(key);
    } catch (error) {
      console.error(`Erro ao testar ${key}:`, error);
    }
  };

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {keys.map((key) => {
          const config = integrationConfig[key];
          const state = states[key];
          const connected = state?.connection === 'Conectado';

          return (
            <div
              key={key}
              className={`card-base p-3 text-center transition-all duration-200 hover:shadow-md ${
                connected ? 'ring-2 ring-success-200 dark:ring-success-800' : ''
              }`}
            >
              <div className={`mb-2 ${config.color}`}>{config.icon}</div>
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {config.label.split(' ')[0]}
              </div>
              <div
                className={`w-2 h-2 rounded-full mx-auto ${
                  connected ? 'bg-success-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedIntegrations).map(([category, categoryKeys]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500" />
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryKeys.map((key) => {
              const config = integrationConfig[key];
              const state = states[key];
              const connected = state?.connection === 'Conectado';
              const runOk = state?.lastRunStatus === 'Ok';
              const isLoading = loading === key;
              const hasRecentTest =
                state?.lastTestAt &&
                new Date(state.lastTestAt) > new Date(Date.now() - 5 * 60 * 1000); // últimos 5 min

              return (
                <div
                  key={key}
                  className={`card-base p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                    connected
                      ? 'ring-2 ring-success-200 dark:ring-success-800 bg-gradient-to-br from-success-50 to-white dark:from-success-900/10 dark:to-slate-800'
                      : 'hover:border-primary-200 dark:hover:border-primary-800'
                  }`}
                  role="region"
                  aria-label={`Integração ${config.label}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          connected
                            ? 'bg-success-100 dark:bg-success-900/20'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        <div
                          className={
                            connected
                              ? 'text-success-600 dark:text-success-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }
                        >
                          {config.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {config.label}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        connected
                          ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          connected ? 'bg-success-500' : 'bg-slate-400'
                        }`}
                      />
                      {connected ? 'Conectado' : 'Desconectado'}
                    </div>
                  </div>

                  {/* Status do último teste */}
                  {state?.lastRunStatus && (
                    <div
                      className={`mb-4 p-3 rounded-lg border ${
                        runOk
                          ? 'border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/10'
                          : 'border-danger-200 bg-danger-50 dark:border-danger-800 dark:bg-danger-900/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {runOk ? (
                          <FaCheckCircle
                            className="text-success-600 dark:text-success-400"
                            size={14}
                          />
                        ) : (
                          <FaExclamationCircle
                            className="text-danger-600 dark:text-danger-400"
                            size={14}
                          />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            runOk
                              ? 'text-success-700 dark:text-success-300'
                              : 'text-danger-700 dark:text-danger-300'
                          }`}
                        >
                          Último teste: {state.lastRunStatus}
                        </span>
                        {hasRecentTest && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                            Recente
                          </span>
                        )}
                      </div>
                      {state.lastTestAt && (
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {new Date(state.lastTestAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={connected ? 'secondary' : 'primary'}
                      onClick={() => onConnectToggle(key)}
                      icon={connected ? <FaUnlink /> : <FaLink />}
                      className="flex-1"
                      aria-label={
                        connected
                          ? `Reautenticar ${config.label}`
                          : `Conectar ${config.label}`
                      }
                    >
                      {connected ? 'Reautenticar' : 'Conectar'}
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleTest(key)}
                      icon={
                        isLoading ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaPlug />
                        )
                      }
                      disabled={isLoading}
                      aria-label={`Testar ${config.label}`}
                      className="px-3"
                    >
                      {isLoading ? '' : 'Testar'}
                    </Button>
                  </div>

                  {/* Informações adicionais */}
                  {connected &&
                    state?.mappedTargets &&
                    state.mappedTargets.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                          Alvos configurados:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {state.mappedTargets.slice(0, 3).map((target, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                            >
                              {target}
                            </span>
                          ))}
                          {state.mappedTargets.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                              +{state.mappedTargets.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Resumo geral */}
      <div className="card-base p-5 bg-gradient-to-r from-slate-50 to-primary-50 dark:from-slate-800 dark:to-primary-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Status das Integrações
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Gerencie todas as conexões de automação
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {Object.values(states).filter((s) => s?.connection === 'Conectado').length}
              <span className="text-lg font-normal text-slate-500 dark:text-slate-400">
                /{keys.length}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">conectadas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationPills;
