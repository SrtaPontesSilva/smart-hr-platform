import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  FaPlus,
  FaCalendarAlt,
  FaChartPie,
  FaComments,
  FaSave,
  FaTimes,
  FaSmile,
  FaFrown,
  FaMeh,
  FaAngry,
  FaSadTear,
  FaSearch,
  FaEdit,
  FaTrash,
  FaQuoteLeft,
  FaClock,
  FaHashtag,
  FaTag,
  FaTags,
  FaChevronDown,
  FaFilter,
  FaCheck
} from 'react-icons/fa';

import { Card, SectionHeader, Button, EmptyState, designTokens } from './DesignSystem';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Observacao {
  id: number;
  data: string; // ISO string
  texto: string;
  tags?: string[]; // tags da observação
}

export interface GraficoObservacoesSectionProps {
  chartData: any;
  chartOptions: any;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  filteredObservations: Observacao[];

  // Novo bloco para criação de observação
  showNewObservation: boolean;
  setShowNewObservation: (value: boolean) => void;
  newObservationInputId: string;
  newObservationText: string;
  setNewObservationText: (value: string) => void;

  // Compatibilidade + novos recursos com tags
  handleAddObservation: () => void;
  newObservationTags?: string[];
  setNewObservationTags?: (value: string[]) => void;
  handleAddObservationWithTags?: (tags: string[]) => void;
  onUpdateObservationTags?: (id: number, tags: string[]) => void;
}

type SentimentKey =
  | 'felicidade'
  | 'tristeza'
  | 'neutro'
  | 'raiva'
  | 'desgosto'
  | 'nojo'
  | 'medo'
  | string;

const sentimentConfig: Record<
  SentimentKey,
  {
    icon: JSX.Element;
    color: string;
    bgColor: string;
    borderColor: string;
    gradientFrom: string;
    gradientTo: string;
  }
> = {
  felicidade: {
    icon: <FaSmile className="text-2xl" />,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600',
  },
  tristeza: {
    icon: <FaSadTear className="text-2xl" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
  },
  raiva: {
    icon: <FaAngry className="text-2xl" />,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-red-600',
  },
  neutro: {
    icon: <FaMeh className="text-2xl" />,
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-800',
    gradientFrom: 'from-gray-500',
    gradientTo: 'to-gray-600',
  },
  desgosto: {
    icon: <FaFrown className="text-2xl" />,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
  },
  nojo: {
    icon: <FaFrown className="text-2xl" />,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
  },
  medo: {
    icon: <FaFrown className="text-2xl" />,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600',
  },
};

const SentimentItem: React.FC<{ label: string; value: number; total: number }> = ({
  label,
  value,
  total,
}) => {
  const cfg = sentimentConfig[label.toLowerCase() as SentimentKey] ?? sentimentConfig.neutro;
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div
      className={`rounded-xl border p-4 ${designTokens.transitions.normal} hover:shadow-sm ${cfg.bgColor} ${cfg.borderColor}`}
    >
      <div className="flex items-center gap-4">
        <div className={cfg.color}>{cfg.icon}</div>
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`${designTokens.typography.heading.h5} text-gray-900 dark:text-gray-100`}
            >
              {label}
            </span>
            <div className={`${designTokens.typography.heading.h5} ${cfg.color}`}>{value}</div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full bg-gradient-to-r ${cfg.gradientFrom} ${cfg.gradientTo}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ObservationCard: React.FC<{
  obs: Observacao;
  index: number;
  onUpdateTags?: (id: number, tags: string[]) => void;
  allAvailableTags: string[];
}> = ({ obs, index, onUpdateTags, allAvailableTags }) => {
  const [expanded, setExpanded] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [localTags, setLocalTags] = useState<string[]>(obs.tags ?? []);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setLocalTags(obs.tags ?? []), [obs.tags]);

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (!tag) return;
    if (localTags.includes(tag)) return;
    const next = [...localTags, tag];
    setLocalTags(next);
    onUpdateTags?.(obs.id, next);
    setTagInput('');
    
    // Salvar no localStorage
    const storageKey = 'innova-observation-tags';
    const existingTags = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedTags = Array.from(new Set([...existingTags, tag]));
    localStorage.setItem(storageKey, JSON.stringify(updatedTags));
  };

  const removeTag = (tag: string) => {
    const next = localTags.filter((t) => t !== tag);
    setLocalTags(next);
    onUpdateTags?.(obs.id, next);
  };

  const onTagInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Backspace' && !tagInput && localTags.length) {
      removeTag(localTags[localTags.length - 1]);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setExpanded((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setExpanded((v) => !v);
        }
      }}
      className={`group rounded-xl border p-6 ${designTokens.transitions.normal} cursor-pointer hover:shadow-md ${
        expanded
          ? 'border-blue-500 bg-blue-50 dark:border-blue-500/60 dark:bg-blue-900/20'
          : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-3 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <FaCalendarAlt className="text-xs" />
              {new Date(obs.data).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              <FaHashtag className="text-xs" />
              {index + 1}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              <FaClock className="text-xs" />
              {obs.texto.length} chars
            </div>
          </div>

          {/* Texto */}
          <div className="relative">
            <FaQuoteLeft className="absolute -left-4 -top-1 text-gray-300 dark:text-gray-600" />
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-100">
              {obs.texto}
            </p>
          </div>

          {/* Tags */}
          {expanded && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {(localTags ?? []).map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Chip de tag ${tag}`}
                  >
                    <FaTag className="opacity-70" /> {tag}
                    {onUpdateTags && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(tag);
                        }}
                        className="ml-1 rounded-full p-1 hover:bg-primary-200 dark:hover:bg-primary-800"
                        aria-label={`Remover tag ${tag}`}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </button>
                ))}
              </div>

              {onUpdateTags && (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={onTagInputKeyDown}
                      placeholder="Adicionar nova tag..."
                      className={`${designTokens.transitions.normal} w-full rounded-full border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      type="button"
                      aria-label="Adicionar tag"
                      onClick={(e) => {
                        e.stopPropagation();
                        addTag(tagInput);
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {/* Tags sugeridas */}
                  {allAvailableTags.length > 0 && (
                    <div>
                      <div className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                        Tags disponíveis:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {allAvailableTags
                          .filter(tag => !localTags.includes(tag))
                          .map((tag) => (
                            <button
                              type="button"
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                addTag(tag);
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              <FaTag className="opacity-70" /> {tag}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="sm" icon={<FaEdit />}>
            <span className="sr-only">Editar</span>
          </Button>
          <Button variant="ghost" size="sm" icon={<FaTrash />}>
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Componente de filtro em dropdown/cascata
const TagFilterDropdown: React.FC<{
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearAll: () => void;
}> = ({ allTags, selectedTags, onToggleTag, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (allTags.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
          selectedTags.length > 0
            ? 'border-primary bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-900/20 dark:text-primary-300'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FaFilter className="text-xs" />
        <span>Tags</span>
        {selectedTags.length > 0 && (
          <span className="rounded-full bg-primary text-xs text-white px-1.5 py-0.5 min-w-[16px]">
            {selectedTags.length}
          </span>
        )}
        <FaChevronDown className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-10 mt-1 w-64 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Filtrar por tags
              </span>
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs text-primary hover:text-primary-dark"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    isSelected ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && <FaCheck className="text-white text-xs" />}
                  </div>
                  <FaTag className="text-xs opacity-70" />
                  <span className="flex-1">{tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const GraficoObservacoesSection: React.FC<GraficoObservacoesSectionProps> = (props) => {
  const {
    chartData,
    chartOptions,
    dateFilter,
    setDateFilter,
    filteredObservations,
    showNewObservation,
    newObservationText,
    newObservationInputId,
    setShowNewObservation,
    setNewObservationText,
    handleAddObservation,
    newObservationTags,
    setNewObservationTags,
    handleAddObservationWithTags,
    onUpdateObservationTags,
  } = props;

  // ====== Filtros ======
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // ====== Nova observação (tags locais com fallback às props) ======
  const [activeNewTags, setActiveNewTagsState] = useState<string[]>(
    newObservationTags ?? []
  );
  const [newTagInput, setNewTagInput] = useState('');
  const tagsInputId = 'new-observation-tag-input';
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (newObservationTags) setActiveNewTagsState(newObservationTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newObservationTags?.join('|')]);

  const setActiveNewTags = (tags: string[]) => {
    setActiveNewTagsState(tags);
    setNewObservationTags?.(tags);
  };

  // Todas as tags conhecidas (para sugestões) - carrega do localStorage também
  const allAvailableTags = useMemo(() => {
    const s = new Set<string>();
    filteredObservations.forEach((o) => (o.tags ?? []).forEach((t) => s.add(t)));
    
    // Adicionar tags salvas no localStorage
    const storedTags = JSON.parse(localStorage.getItem('innova-observation-tags') || '[]');
    storedTags.forEach((tag: string) => s.add(tag));
    
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [filteredObservations]);

  // Aplicar filtros de busca e tags
  const searchFilteredObservations = useMemo(
    () =>
      filteredObservations.filter((obs) => {
        const byText = obs.texto
          .toLowerCase()
          .includes(searchFilter.toLowerCase());
        const byTags =
          selectedTags.length === 0 ||
          (obs.tags?.some((t) => selectedTags.includes(t)) ?? false);
        return byText && byTags;
      }),
    [filteredObservations, searchFilter, selectedTags]
  );

  // Cores restauradas para o gráfico
  const enhancedChartData = useMemo(() => {
    if (!chartData) return chartData;
    
    return {
      ...chartData,
      datasets: chartData.datasets?.map((dataset: any) => ({
        ...dataset,
        backgroundColor: [
          '#EF4444', // Raiva - vermelho (danger)
          '#10B981', // Felicidade - verde (success)  
          '#22C1FF', // Tristeza - azul (secondary)
          '#6B7280', // Medo - cinza
          '#5E3BFF', // Nojo - roxo (primary)
        ],
        borderColor: [
          '#DC2626',
          '#059669', 
          '#0EA5E9',
          '#4B5563',
          '#4338CA',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      }))
    };
  }, [chartData]);

  const chartMetrics = useMemo(() => {
    const total = (enhancedChartData?.datasets?.[0]?.data ?? []).reduce(
      (a: number, b: number) => a + b,
      0
    );
    const maxValue = Math.max(...(enhancedChartData?.datasets?.[0]?.data ?? [0]));
    const dominantIndex = (enhancedChartData?.datasets?.[0]?.data ?? [0]).indexOf(
      maxValue
    );
    const dominantLabel = (enhancedChartData?.labels ?? [])[dominantIndex] ?? '';
    const dominantPercentage = total > 0 ? ((maxValue / total) * 100).toFixed(1) : '0';
    return { total, dominant: dominantLabel, dominantPercentage };
  }, [enhancedChartData]);

  const addNewTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (!tag) return;
    if (activeNewTags.includes(tag)) return;
    setActiveNewTags([...activeNewTags, tag]);
    setNewTagInput('');
    
    // Salvar no localStorage
    const storageKey = 'innova-observation-tags';
    const existingTags = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedTags = Array.from(new Set([...existingTags, tag]));
    localStorage.setItem(storageKey, JSON.stringify(updatedTags));
  };

  const removeNewTag = (tag: string) => {
    setActiveNewTags(activeNewTags.filter((t) => t !== tag));
  };

  const toggleFilterTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilterTags = () => setSelectedTags([]);

  const onSaveObservation = () => {
    if (!newObservationText.trim()) {
      return;
    }

    // Salvar observação com tags no localStorage
    const observationData = {
      id: Date.now(),
      data: new Date().toISOString().slice(0, 10),
      texto: newObservationText.trim(),
      tags: activeNewTags
    };

    const storageKey = 'innova-observations';
    const existingObservations = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedObservations = [...existingObservations, observationData];
    localStorage.setItem(storageKey, JSON.stringify(updatedObservations));

    if (handleAddObservationWithTags) {
      handleAddObservationWithTags(activeNewTags);
    } else {
      handleAddObservation();
    }
    
    // limpar campos locais
    setActiveNewTags([]);
    setNewTagInput('');
  };

  return (
    <div className="space-y-6">
      {/* Resumo / Sentimentos */}
      <Card variant="elevated">
        <SectionHeader
          title="Resumo de Sentimentos"
          subtitle="Distribuição de sentimentos nas observações"
          icon={<FaChartPie />}
        />
        <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="flex justify-center">
            <div className="relative h-64 w-64">
              <Doughnut
                data={enhancedChartData}
                options={{ 
                  ...chartOptions, 
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      borderColor: '#5E3BFF',
                      borderWidth: 1,
                    }
                  },
                  maintainAspectRatio: false,
                }}
                datasetIdKey="sentiment"
                redraw
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p
                    className={`${designTokens.typography.heading.h2} text-gray-900 dark:text-gray-100`}
                  >
                    {chartMetrics.total}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total de Pontos
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {(enhancedChartData?.labels ?? []).map((label: string, idx: number) => (
              <SentimentItem
                key={`${label}-${idx}`}
                label={label}
                value={enhancedChartData?.datasets?.[0]?.data?.[idx] ?? 0}
                total={chartMetrics.total}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Observações e Feedback */}
      <Card variant="elevated">
        <SectionHeader
          title="Observações e Feedback"
          subtitle={`${filteredObservations.length} observação(ões) registrada(s)`}
          icon={<FaComments />}
          actions={
            <Button
              onClick={() => props.setShowNewObservation(!props.showNewObservation)}
              variant="primary"
              size="sm"
              icon={<FaPlus />}
            >
              {props.showNewObservation ? 'Cancelar' : 'Nova Observação'}
            </Button>
          }
        />

        <div className="mt-6 space-y-6">
          {/* Filtros */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              {/* Data */}
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="flex-shrink-0 text-gray-400" />
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="date-filter"
                    className={`${designTokens.typography.label} whitespace-nowrap text-gray-700 dark:text-gray-200`}
                  >
                    Data
                  </label>
                  <input
                    id="date-filter"
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Busca */}
              <div className="flex items-center gap-3 flex-1">
                <FaSearch className="flex-shrink-0 text-gray-400" />
                <div className="flex items-center gap-2 flex-1">
                  <label
                    htmlFor="search-filter"
                    className={`${designTokens.typography.label} whitespace-nowrap text-gray-700 dark:text-gray-200`}
                  >
                    Buscar
                  </label>
                  <input
                    id="search-filter"
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Digite um termo…"
                    className="flex-1 min-w-0 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Filtro por tags - Dropdown */}
              <TagFilterDropdown
                allTags={allAvailableTags}
                selectedTags={selectedTags}
                onToggleTag={toggleFilterTag}
                onClearAll={clearFilterTags}
              />
            </div>
          </div>

          {/* Nova observação */}
          {showNewObservation && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 dark:border-gray-600 dark:bg-gray-900/40">
              <div className="space-y-4">
                {/* Texto da observação */}
                <div>
                  <label
                    htmlFor={newObservationInputId}
                    className={`${designTokens.typography.label} mb-2 block text-gray-700 dark:text-gray-200`}
                  >
                    Nova Observação
                  </label>
                  <textarea
                    id={newObservationInputId}
                    rows={4}
                    value={newObservationText}
                    onChange={(e) => setNewObservationText(e.target.value)}
                    placeholder="Escreva a observação…"
                    className="w-full resize-y rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {newObservationText.length} caracteres
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label
                    htmlFor={tagsInputId}
                    className={`${designTokens.typography.label} mb-2 block text-gray-700 dark:text-gray-200`}
                  >
                    Tags <span className="text-xs text-gray-500">(pressione Enter ou vírgula para adicionar)</span>
                  </label>
                  
                  {/* Tags selecionadas */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {activeNewTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs text-primary-700 dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                      >
                        <FaTag className="opacity-70" /> {tag}
                        <button
                          type="button"
                          aria-label={`Remover tag ${tag}`}
                          onClick={() => removeNewTag(tag)}
                          className="ml-1 rounded-full p-1 hover:bg-primary-200 dark:hover:bg-primary-800"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Input para nova tag */}
                  <div className="relative mb-3">
                    <input
                      ref={inputRef}
                      id={tagsInputId}
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          addNewTag(newTagInput);
                        }
                        if (e.key === 'Backspace' && !newTagInput && activeNewTags.length > 0) {
                          removeNewTag(activeNewTags[activeNewTags.length - 1]);
                        }
                      }}
                      placeholder="Adicionar tag (ex.: falta, relatório semanal)"
                      className="w-full rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      aria-label="Adicionar tag"
                      onClick={() => addNewTag(newTagInput)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {/* Tags disponíveis para seleção */}
                  {allAvailableTags.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                        <FaTags />
                        <span>Tags disponíveis:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allAvailableTags
                          .filter(tag => !activeNewTags.includes(tag))
                          .map((tag) => (
                            <button
                              type="button"
                              key={tag}
                              onClick={() => setActiveNewTags([...activeNewTags, tag])}
                              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                              <FaTag className="opacity-70" /> {tag}
                            </button>
                          ))}
                        <button
                          type="button"
                          onClick={() => inputRef.current?.focus()}
                          className="inline-flex items-center gap-2 rounded-full border border-dashed border-gray-400 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <FaPlus /> Nova tag
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  onClick={() => {
                    setShowNewObservation(false);
                    setNewObservationText('');
                    setActiveNewTags([]);
                    setNewTagInput('');
                  }}
                  variant="secondary"
                  size="sm"
                  icon={<FaTimes />}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={onSaveObservation}
                  variant="primary"
                  size="sm"
                  icon={<FaSave />}
                  disabled={!newObservationText.trim()}
                >
                  Salvar Observação
                </Button>
              </div>
            </div>
          )}

          {/* Lista de observações */}
          {searchFilteredObservations.length === 0 ? (
            <EmptyState
              icon={filteredObservations.length === 0 ? <FaComments /> : <FaSearch />}
              title={
                filteredObservations.length === 0
                  ? 'Nenhuma observação registrada'
                  : 'Nenhum resultado encontrado'
              }
              subtitle={
                filteredObservations.length === 0
                  ? 'Comece registrando a primeira observação deste colaborador'
                  : 'Tente ajustar os filtros ou termos de busca'
              }
              action={
                filteredObservations.length === 0 && (
                  <Button
                    onClick={() => setShowNewObservation(true)}
                    variant="primary"
                    size="sm"
                    icon={<FaPlus />}
                  >
                    Adicionar primeira observação
                  </Button>
                )
              }
            />
          ) : (
            <div className="max-h-96 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {searchFilteredObservations.map((obs, idx) => (
                <ObservationCard
                  key={obs.id}
                  obs={obs}
                  index={idx}
                  onUpdateTags={onUpdateObservationTags}
                  allAvailableTags={allAvailableTags}
                />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GraficoObservacoesSection;