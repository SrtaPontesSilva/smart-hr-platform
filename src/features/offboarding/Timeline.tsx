// frontend/src/features/offboarding/Timeline.tsx
import React, { useMemo, useState } from 'react';
import { 
  FaBolt, 
  FaCheck, 
  FaClock,
  FaFilter, 
  FaStream, 
  FaUserEdit,
  FaPlus,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes
} from 'react-icons/fa';

import { Button, Badge, Card, Input } from '../employee/DesignSystem';

import type { AuditEvent, AuditEventType } from './offboarding';

/**
 * Timeline de Auditoria melhorada com filtros avançados e design aprimorado
 * Suporte completo ao modo escuro e melhor organização visual
 */
type Props = {
  events: AuditEvent[];
  allowAddEvent?: boolean;
  onAddEvent?: (event: Omit<AuditEvent, 'id' | 'at'>) => void;
};

const iconByType: Record<AuditEventType, { icon: React.ReactNode; color: string }> = {
  create: { 
    icon: <FaPlus size={14} />, 
    color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20' 
  },
  update: { 
    icon: <FaUserEdit size={14} />, 
    color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' 
  },
  checklist: { 
    icon: <FaCheck size={14} />, 
    color: 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/20' 
  },
  automation: { 
    icon: <FaBolt size={14} />, 
    color: 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/20' 
  },
};

const labelByType: Record<AuditEventType, string> = {
  create: 'Criação',
  update: 'Edição',
  checklist: 'Checklist',
  automation: 'Automação',
};

const priorityByType: Record<AuditEventType, 'low' | 'medium' | 'high'> = {
  create: 'high',
  update: 'medium',
  checklist: 'medium',
  automation: 'low',
};

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Agora mesmo';
  if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  return date.toLocaleDateString();
};

export const Timeline: React.FC<Props> = ({ 
  events, 
  allowAddEvent = false, 
  onAddEvent 
}) => {
  const [filter, setFilter] = useState<AuditEventType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'update' as AuditEventType,
    message: '',
    by: 'usuário'
  });

  // Ordenar e filtrar eventos
  const { visible, stats } = useMemo(() => {
    let filtered = [...events];
    
    // Filtro por tipo
    if (filter !== 'all') {
      filtered = filtered.filter((e) => e.type === filter);
    }
    
    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((e) => 
        e.message.toLowerCase().includes(query) ||
        e.by.toLowerCase().includes(query) ||
        labelByType[e.type].toLowerCase().includes(query)
      );
    }
    
    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
    
    // Calcular estatísticas
    const stats = {
      total: events.length,
      filtered: filtered.length,
      byType: Object.entries(labelByType).reduce((acc, [type]) => {
        acc[type as AuditEventType] = events.filter(e => e.type === type).length;
        return acc;
      }, {} as Record<AuditEventType, number>)
    };
    
    return { visible: filtered, stats };
  }, [events, filter, searchQuery]);

  const handleAddEvent = () => {
    if (!newEvent.message.trim() || !onAddEvent) return;
    
    onAddEvent({
      type: newEvent.type,
      message: newEvent.message.trim(),
      by: newEvent.by || 'usuário'
    });
    
    setNewEvent({ type: 'update', message: '', by: 'usuário' });
    setShowAddForm(false);
  };

  const groupEventsByDate = (events: AuditEvent[]) => {
    const groups: { [date: string]: AuditEvent[] } = {};
    
    events.forEach(event => {
      const date = new Date(event.at).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(event);
    });
    
    return groups;
  };

  const groupedEvents = groupEventsByDate(visible);

  return (
    <Card padding="lg" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FaStream className="text-slate-400 dark:text-slate-500" />
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Linha do Tempo
            </h4>
          </div>
          <Badge variant="default">
            {stats.total} eventos
          </Badge>
        </div>
        
        {allowAddEvent && (
          <Button
            size="sm"
            variant="primary"
            icon={<FaPlus />}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Adicionar Evento
          </Button>
        )}
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(labelByType).map(([type, label]) => (
          <button
            key={type}
            onClick={() => setFilter(filter === type ? 'all' : type as AuditEventType)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
              filter === type
                ? 'border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1 rounded ${iconByType[type as AuditEventType].color}`}>
                {iconByType[type as AuditEventType].icon}
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {label}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {stats.byType[type as AuditEventType] || 0}
            </div>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar em eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<FaFilter size={14} />}
            size="sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select
            className="input-base text-sm py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value as AuditEventType | 'all')}
          >
            <option value="all">Todos os tipos</option>
            {Object.entries(labelByType).map(([type, label]) => (
              <option key={type} value={type}>
                {label}
              </option>
            ))}
          </select>
          
          {(filter !== 'all' || searchQuery) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              icon={<FaTimes />}
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Formulário de adicionar evento */}
      {showAddForm && allowAddEvent && (
        <Card padding="md" className="border-2 border-dashed border-primary-300 dark:border-primary-700">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <select
                className="input-base text-sm"
                value={newEvent.type}
                onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as AuditEventType }))}
              >
                {Object.entries(labelByType).map(([type, label]) => (
                  <option key={type} value={type}>
                    {label}
                  </option>
                ))}
              </select>
              
              <Input
                placeholder="Quem realizou a ação?"
                value={newEvent.by}
                onChange={(e) => setNewEvent(prev => ({ ...prev, by: e.target.value }))}
                size="sm"
                className="max-w-40"
              />
            </div>
            
            <Input
              placeholder="Descreva o que aconteceu..."
              value={newEvent.message}
              onChange={(e) => setNewEvent(prev => ({ ...prev, message: e.target.value }))}
              size="sm"
            />
            
            <div className="flex items-center gap-2 justify-end">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddEvent}
                disabled={!newEvent.message.trim()}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline */}
      <div className="relative">
        {stats.filtered === 0 ? (
          <div className="text-center py-12">
            <FaClock className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-2">
              {stats.total === 0 ? 'Nenhum evento registrado' : 'Nenhum evento encontrado'}
            </p>
            {searchQuery && (
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Tente ajustar os filtros de busca
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEvents).map(([date, dateEvents]) => (
              <div key={date}>
                {/* Separador de data */}
                <div className="sticky top-0 z-10 flex items-center gap-3 mb-4">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border">
                    {date}
                  </div>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <Badge size="sm" variant="default">
                    {dateEvents.length} eventos
                  </Badge>
                </div>

                {/* Eventos do dia */}
                <div className="space-y-3 ml-4">
                  {dateEvents.map((event, idx) => {
                    const config = iconByType[event.type];
                    const isLast = idx === dateEvents.length - 1;
                    
                    return (
                      <div key={event.id} className="relative">
                        {/* Linha conectora */}
                        {!isLast && (
                          <div className="absolute left-6 top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                        )}
                        
                        <div className="flex items-start gap-4">
                          {/* Ícone do evento */}
                          <div className={`relative z-10 p-2 rounded-full border-2 border-white dark:border-slate-900 ${config.color}`}>
                            {config.icon}
                          </div>
                          
                          {/* Conteúdo do evento */}
                          <div className="flex-1 min-w-0">
                            <div className="card-base p-4 hover:shadow-md transition-all duration-200">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge 
                                      variant={
                                        event.type === 'create' ? 'info' :
                                        event.type === 'checklist' ? 'success' :
                                        event.type === 'automation' ? 'primary' : 'default'
                                      }
                                      size="sm"
                                    >
                                      {labelByType[event.type]}
                                    </Badge>
                                    
                                    {priorityByType[event.type] === 'high' && (
                                      <FaExclamationCircle className="text-warning-500 dark:text-warning-400" size={12} />
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {event.message}
                                  </p>
                                  
                                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="font-medium">{event.by}</span>
                                    <span>•</span>
                                    <time dateTime={event.at}>
                                      {getRelativeTime(event.at)}
                                    </time>
                                    <span>•</span>
                                    <span>
                                      {new Date(event.at).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Metadados adicionais */}
                                {event.meta && Object.keys(event.meta).length > 0 && (
                                  <button
                                    className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    title="Ver detalhes"
                                  >
                                    <FaInfoCircle size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumo no final */}
      {stats.filtered > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>
              Mostrando {stats.filtered} de {stats.total} eventos
            </span>
            {filter !== 'all' && (
              <span>
                Filtrado por: {labelByType[filter]}
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default Timeline;