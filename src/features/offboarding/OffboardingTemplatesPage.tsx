// frontend/src/features/offboarding/OffboardingTemplatesPage.tsx
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaRegEdit, FaSave, FaTimes } from 'react-icons/fa';

import PageHeader from '../../layout/RH/PageHeader';
import { Button } from '../employee/DesignSystem';

import type { ChecklistArea, ChecklistItemExt } from './offboarding';

type Template = {
  id: string;
  name: string;
  tipo: 'pedido' | 'sem_justa_causa' | 'término' | 'acordo' | 'outra';
  itens: ChecklistItemExt[]; // já separados por area no campo area
  updatedAt: string;
};

const AREAS: ChecklistArea[] = ['RH', 'TI', 'Gestor', 'Comms'];

const STORAGE_KEY = 'offb_templates';
const DEFAULT_KEY  = 'offb_templates_default_by_tipo'; // { [tipo]: templateId }

const OffboardingTemplatesPage: React.FC = () => {
  const [items, setItems] = useState<Template[]>([]);
  const [editing, setEditing] = useState<Template | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setItems(saved);
  }, []);

  const saveAll = (next: Template[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleNew = () => {
    const t: Template = {
      id: String(Date.now()),
      name: 'Novo template',
      tipo: 'pedido',
      itens: [],
      updatedAt: new Date().toISOString(),
    };
    setEditing(t);
    setDrawerOpen(true);
  };

  const handleEdit = (t: Template) => {
    setEditing({ ...t });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!editing) return;
    const exists = items.some((i) => i.id === editing.id);
    const next = exists ? items.map((i) => (i.id === editing.id ? { ...editing, updatedAt: new Date().toISOString() } : i))
                        : [{ ...editing, updatedAt: new Date().toISOString() }, ...items];
    saveAll(next);
    setDrawerOpen(false);
    toast.success('Template salvo!', { icon: '🧩' });
  };

  const setDefaultForTipo = (t: Template) => {
    const map = JSON.parse(localStorage.getItem(DEFAULT_KEY) || '{}');
    map[t.tipo] = t.id;
    localStorage.setItem(DEFAULT_KEY, JSON.stringify(map));
    toast.success(`Template padrão definido para tipo "${t.tipo}"`);
  };

  const countByArea = (t: Template, a: ChecklistArea) => t.itens.filter((i) => i.area === a).length;

  return (
    <div className="container mx-auto px-3 py-6">
      <PageHeader
        title="Templates de checklist"
        subtitle="Crie e edite modelos por tipo de desligamento"
        actions={<Button size="sm" variant="primary" icon={<FaPlus />} onClick={handleNew}>Novo template</Button>}
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">#Itens</th>
              <th className="px-4 py-3 text-left">Última atualização</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Nenhum template. Crie o primeiro!</td></tr>
            )}
            {items.map((t) => (
              <tr key={t.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="px-4 py-3">{t.name}</td>
                <td className="px-4 py-3 capitalize">{t.tipo.replace('_',' ')}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2 text-2xs">
                    {AREAS.map((a) => (
                      <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-700">
                        {a}: {countByArea(t, a)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">{new Date(t.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="secondary" icon={<FaRegEdit />} onClick={() => handleEdit(t)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setDefaultForTipo(t)}>
                      Definir como padrão
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer editor */}
      {drawerOpen && editing && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} aria-hidden />
          <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 p-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Editar template</h3>
              <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setDrawerOpen(false)} aria-label="Fechar">
                <FaTimes />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <label className="block text-sm">
                Nome
                <input className="input-base mt-1" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </label>
              <label className="block text-sm">
                Tipo
                <select
                  className="input-base mt-1"
                  value={editing.tipo}
                  onChange={(e) => setEditing({ ...editing, tipo: e.target.value as Template['tipo'] })}
                >
                  <option value="pedido">Pedido</option>
                  <option value="sem_justa_causa">Sem justa causa</option>
                  <option value="término">Término</option>
                  <option value="acordo">Acordo</option>
                  <option value="outra">Outra</option>
                </select>
              </label>

              {/* editor de itens por área */}
              {AREAS.map((a) => {
                const itemsArea = editing.itens.filter((i) => i.area === a);
                const addItem = () => {
                  const it: ChecklistItemExt = { key: `${a}-${Date.now()}`, label: 'Novo item', area: a, priority: 'media', automatable: false };
                  setEditing((ed) => ({ ...(ed as Template), itens: [...(ed?.itens ?? []), it] }));
                };
                const updateItem = (k: string, patch: Partial<ChecklistItemExt>) => {
                  setEditing((ed) => {
                    if (!ed) return ed as any;
                    return { ...ed, itens: ed.itens.map((i) => (i.key === k ? { ...i, ...patch } : i)) };
                  });
                };
                const removeItem = (k: string) => {
                  setEditing((ed) => ({ ...(ed as Template), itens: ed!.itens.filter((i) => i.key !== k) }));
                };

                return (
                  <section key={a} className="card-base p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <strong className="text-sm">{a}</strong>
                      <Button size="sm" variant="secondary" onClick={addItem} icon={<FaPlus />}>Adicionar</Button>
                    </div>
                    <ul className="space-y-2">
                      {itemsArea.map((it) => (
                        <li key={it.key} className="rounded border border-slate-200 dark:border-slate-700 p-2">
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <label className="text-xs">
                              Título
                              <input className="input-base mt-1" value={it.label} onChange={(e) => updateItem(it.key, { label: e.target.value })} />
                            </label>
                            <label className="text-xs">
                              Prioridade
                              <select className="input-base mt-1" value={it.priority ?? 'media'} onChange={(e) => updateItem(it.key, { priority: e.target.value as any })}>
                                <option value="baixa">baixa</option>
                                <option value="media">media</option>
                                <option value="alta">alta</option>
                                <option value="critica">critica</option>
                              </select>
                            </label>
                            <label className="text-xs sm:col-span-2">
                              Descrição
                              <input className="input-base mt-1" value={it.description ?? ''} onChange={(e) => updateItem(it.key, { description: e.target.value })} />
                            </label>
                            <div className="flex items-center gap-3">
                              <label className="inline-flex items-center gap-2 text-xs">
                                <input type="checkbox" checked={!!it.automatable} onChange={(e) => updateItem(it.key, { automatable: e.target.checked })} />
                                automatizável
                              </label>
                              <label className="inline-flex items-center gap-2 text-xs">
                                <input type="checkbox" checked={!!it.requiresEvidence} onChange={(e) => updateItem(it.key, { requiresEvidence: e.target.checked })} />
                                requer evidência
                              </label>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-end">
                            <Button size="sm" variant="secondary" onClick={() => removeItem(it.key)}>
                              Remover
                            </Button>
                          </div>
                        </li>
                      ))}
                      {itemsArea.length === 0 && <li className="text-2xs text-slate-500">Sem itens.</li>}
                    </ul>
                  </section>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => setDrawerOpen(false)} icon={<FaTimes />}>Cancelar</Button>
              <Button size="sm" variant="primary" onClick={handleSave} icon={<FaSave />}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffboardingTemplatesPage;
