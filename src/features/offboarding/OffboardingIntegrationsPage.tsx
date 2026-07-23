// frontend/src/features/offboarding/OffboardingIntegrationsPage.tsx
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import PageHeader from '../../layout/RH/PageHeader';
import { Button } from '../employee/DesignSystem';

import AutomationPills from './AutomationPills';
import type { IntegrationKey, IntegrationState } from './offboarding';

/**
 * Tela de Configurações de Integrações
 * - UI de conexão/reautenticação
 * - "Testar agora" (mock) + timestamp
 * - Mapeamentos simples (mock) para revogação em massa
 */

const STORAGE_KEY = 'offb_integrations_state';

const IntegrationsPage: React.FC = () => {
  const [states, setStates] = useState<Partial<Record<IntegrationKey, IntegrationState>>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setStates(JSON.parse(saved));
    else {
      const initial: Partial<Record<IntegrationKey, IntegrationState>> = {
        google:  { key: 'google', connection: 'Desconectado', mappedTargets: ['@empresa.com'] },
        ad:      { key: 'ad', connection: 'Desconectado', mappedTargets: ['OU=Colaboradores'] },
        slack:   { key: 'slack', connection: 'Desconectado', mappedTargets: ['#geral', '#ti'] },
        teams:   { key: 'teams', connection: 'Desconectado', mappedTargets: ['Equipe RH'] },
        clickup: { key: 'clickup', connection: 'Desconectado', mappedTargets: ['Time Produto'] },
        trello:  { key: 'trello', connection: 'Desconectado', mappedTargets: ['Board RH'] },
        github:  { key: 'github', connection: 'Desconectado', mappedTargets: ['org/empresa/*'] },
      };
      setStates(initial);
    }
  }, []);

  const simulateDelay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

  const onConnectToggle = (key: IntegrationKey) => {
    setStates((curr) => {
      const prev = curr[key];
      const nextConn = prev?.connection === 'Conectado' ? 'Desconectado' : 'Conectado';
      const next = { ...(curr || {}), [key]: { ...(prev as any), key, connection: nextConn } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const onTest = async (key: IntegrationKey) => {
    await simulateDelay(500 + Math.random() * 800);
    const ok = Math.random() > 0.15;
    setStates((curr) => {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    toast[ok ? 'success' : 'error'](`Teste ${key}: ${ok ? 'Ok' : 'Falha'}`);
  };

  const onSaveMappings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
    toast.success('Mapeamentos salvos!', { icon: '🗺️' });
  };

  return (
    <div className="container mx-auto px-3 py-6">
      <PageHeader
        title="Integrações"
        subtitle="Gerencie conexões e testes (mock)"
      />

      <AutomationPills states={states} onConnectToggle={onConnectToggle} onTest={onTest} />

      {/* Mapeamentos simples */}
      <div className="mt-4 card-base p-4">
        <h4 className="text-sm font-semibold">Mapeamentos para revogação em massa</h4>
        <p className="text-xs text-slate-500 mb-3">Somente UI — edite os valores e salve.</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(states).map(([k, v]) => (
            <label key={k} className="text-xs">
              {k}
              <input
                className="input-base mt-1"
                value={(v?.mappedTargets ?? []).join(', ')}
                onChange={(e) => {
                  const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                  setStates((curr) => ({ ...(curr || {}), [k]: { ...(v as any), key: k as any, mappedTargets: list } }));
                }}
              />
            </label>
          ))}
        </div>

        <div className="mt-3 flex justify-end">
          <Button size="sm" variant="primary" onClick={onSaveMappings}>Salvar</Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
