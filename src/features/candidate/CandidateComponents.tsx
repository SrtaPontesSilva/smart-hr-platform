// components/CandidateComponents.tsx - Componentes consolidados

import React, { memo, useState, useEffect, useRef, KeyboardEvent } from 'react';
import {
  FaGraduationCap, FaBriefcase, FaTools, FaFileAlt,
  FaTimes, FaEye, FaCheck, FaDownload, FaSpinner,
  FaChevronDown, FaPlus,
  FaCalendarAlt, FaUniversity
} from 'react-icons/fa';

import {
  Experience,
  Formation,
  ToastMessage,
  AccordionSection,
  EditableFieldProps,
  StatusVariant
} from './Candidate';

// ==================== STRINGS E CONSTANTES ====================

const strings = {
  editProfile: 'Editar Perfil',
  save: 'Salvar',
  cancel: 'Cancelar',
  download: 'Baixar',
  view: 'Visualizar',
  close: 'Fechar',
  loading: 'Carregando...',
  notInformed: 'Não informado',
  loadingProfile: 'Carregando perfil...',
  toggleSectionButton: 'Expandir ou recolher seção',
  viewDocumentButton: 'Visualizar documento',
  downloadDocumentButton: 'Baixar documento'
};

// ==================== FEEDBACK (TOASTS) ====================

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export const Toast = memo<ToastProps>(({ message, type }) => {
  const getToastStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-700';
      case 'error': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <FaCheck className="h-4 w-4" aria-hidden="true" />;
      case 'error': return <FaTimes className="h-4 w-4" aria-hidden="true" />;
      default: return <FaSpinner className="h-4 w-4 animate-spin" aria-hidden="true" />;
    }
  };

  return (
    <div
      className={`
        ${getToastStyles()}
        flex transform animate-slide-in-right items-center gap-3 rounded-lg border px-4
        py-3 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out
      `}
      role="alert"
      aria-live="assertive"
    >
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
});
Toast.displayName = 'Toast';

// Toast Container
interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer = memo<ToastContainerProps>(({ toasts }) => (
  <div
    className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3"
    role="region"
    aria-live="polite"
  >
    {toasts.map(toast => (
      <Toast key={toast.id} message={toast.message} type={toast.type} />
    ))}
  </div>
));
ToastContainer.displayName = 'ToastContainer';

// ==================== COMPONENTES DE LAYOUT ====================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  'aria-labelledby'?: string;
  role?: string;
}

export const Card = memo<CardProps>(({ 
  children, 
  className = '',
  'aria-labelledby': ariaLabelledBy,
  role = 'region'
}) => (
  <div 
    className={`
      rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl
      ${className}
    `}
    role={role}
    aria-labelledby={ariaLabelledBy}
  >
    {children}
  </div>
));
Card.displayName = 'Card';

interface AccordionCardProps {
  section: AccordionSection;
  onToggle: () => void;
  children: React.ReactNode;
}

export const AccordionCard = memo<AccordionCardProps>(({ section, onToggle, children }) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100">
        <button
          type="button"
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          className="flex w-full items-center justify-between px-6 py-4 focus:outline-none"
          aria-expanded={section.isOpen}
          aria-controls={`section-${section.id}-content`}
          id={`section-${section.id}-button`}
          aria-label={`${strings.toggleSectionButton}: ${section.title}`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              {section.icon}
            </div>
            <h3 
              id={`section-${section.id}-title`}
              className="text-lg font-semibold text-gray-900"
            >
              {section.title}
            </h3>
          </div>
          <div 
            className="text-blue-600 transition-transform duration-200"
            style={{ transform: section.isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            aria-hidden="true"
          >
            <FaChevronDown className="h-4 w-4" />
          </div>
        </button>
      </div>
      <div 
        id={`section-${section.id}-content`}
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${section.isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
        `}
        role="region"
        aria-labelledby={`section-${section.id}-title`}
      >
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </Card>
  );
});
AccordionCard.displayName = 'AccordionCard';

/**
 * NOVO SectionCard com API simples:
 * <SectionCard title="..." icon={<.../>} defaultOpen>
 *   ...children...
 * </SectionCard>
 */
export const SectionCard = memo(function SectionCard({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const id = title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\s+/g, '-')
    .replace(/a-z0-9-/g, '');

  const section: AccordionSection = {
    id,
    title,
    icon: icon ?? <FaChevronDown className="h-4 w-4" aria-hidden="true" />,
    isOpen,
  };

  return (
    <AccordionCard section={section} onToggle={() => setIsOpen((v) => !v)}>
      {children}
    </AccordionCard>
  );
});
SectionCard.displayName = 'SectionCard';

// ==================== COMPONENTES EDITÁVEIS ====================

export const EditableField = memo<EditableFieldProps>(({
  label,
  value,
  isEditing,
  onChange,
  type = 'text',
  multiline = false,
  placeholder,
  icon,
  required = false,
  rows = 3
}) => {
  if (!isEditing) {
    return (
      <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          {icon && <span className="text-blue-600">{icon}</span>}
          <span className="text-sm font-medium text-gray-700">
            {label}{required && '*'}:
          </span>
        </div>
        <span className="text-sm text-gray-800 font-medium">
          {value || (
            <span className="text-gray-400">{strings.notInformed}</span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon && <span className="text-blue-600">{icon}</span>}
        {label}{required && '*'}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required={required}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required={required}
        />
      )}
    </div>
  );
});
EditableField.displayName = 'EditableField';

interface EditableSkillsProps {
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (index: number) => void;
  isEditing: boolean;
}

export const EditableSkills = memo<EditableSkillsProps>(({ skills, onAddSkill, onRemoveSkill, isEditing }) => {
  const [newSkill, setNewSkill] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAddSkill = () => {
    const value = newSkill.trim();
    if (!value) return;
    onAddSkill(value);
    setNewSkill('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddSkill();
  };

  const handleRemoveSkill = (index: number) => onRemoveSkill(index);

  if (!isEditing) {
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span key={idx} className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200 px-3 py-1.5">
            {skill}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => handleRemoveSkill(idx)}
              className="rounded-full p-1 hover:bg-blue-100"
              aria-label={`Remover ${skill}`}
            >
              <FaTimes className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Adicionar habilidade"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          aria-label="Nova habilidade"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <FaPlus className="h-4 w-4" aria-hidden="true" />
          Adicionar
        </button>
      </div>
    </div>
  );
});
EditableSkills.displayName = 'EditableSkills';

// ==================== ITENS DE INFORMAÇÃO ====================

interface InfoItemProps {
  icon?: React.ReactNode; // <-- agora é opcional
  label: string;
  value?: React.ReactNode;
}

export const InfoItem = memo<InfoItemProps>(({ icon, label, value }) => (
  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2">
    <div className="flex items-center gap-2">
      {icon ? <span className="text-blue-600">{icon}</span> : null}
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <span className="text-sm font-medium text-gray-900">
      {value || <span className="text-gray-400">{strings.notInformed}</span>}
    </span>
  </div>
));
InfoItem.displayName = 'InfoItem';

interface StatusCardProps {
  icon: React.ReactNode;
  label: string;
  status: string;
  variant?: StatusVariant;
}

export const StatusCard = memo<StatusCardProps>(({ icon, label, status, variant = 'primary' }) => {
  const variants: Record<StatusVariant, string> = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className={`flex items-center justify-between rounded-lg border px-4 py-2 ${variants[variant]}`}>
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span className="text-sm font-bold">{status}</span>
    </div>
  );
});
StatusCard.displayName = 'StatusCard';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  size?: 'small' | 'normal';
}

export const EmptyState = memo<EmptyStateProps>(({ icon, title, subtitle, size = 'normal' }) => {
  const containerSize = size === 'small' ? 'py-6' : 'py-8';
  const iconColor = 'text-gray-400 opacity-50';
  
  return (
    <div className={`flex flex-col items-center justify-center ${containerSize}`}>
      <div className={`mb-3 ${iconColor}`}>{icon}</div>
      <h4 className="text-base font-semibold text-gray-800">{title}</h4>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
});
EmptyState.displayName = 'EmptyState';

// ================ SEÇÕES (EXPERIÊNCIA, FORMAÇÃO, HABILIDADES) ================

interface ExperienceSectionProps {
  experiences: Experience[];
  onRemove?: (index: number) => void;
}

export const ExperienceSection = memo<ExperienceSectionProps>(({ experiences, onRemove }) => {
  if (!experiences || experiences.length === 0) {
    return (
      <EmptyState
        icon={<FaBriefcase className="h-8 w-8" />}
        title="Nenhuma experiência cadastrada"
      />
    );
  }

  return (
    <div className="space-y-3">
      {experiences.map((exp, idx) => (
        <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <FaBriefcase className="h-5 w-5 text-slate-500" aria-hidden="true" />
              <div>
                {/* usa somente chaves garantidas em Experience (company/role, etc.) */}
                <p className="text-sm font-semibold text-slate-800">{(exp as any)?.role ?? strings.notInformed}</p>
                <p className="text-xs text-slate-500">{(exp as any)?.company ?? strings.notInformed}</p>
              </div>
            </div>

            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="inline-flex items-center gap-2 rounded-md bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                aria-label="Remover experiência"
              >
                <FaTimes className="h-4 w-4" aria-hidden="true" />
                Remover
              </button>
            )}
          </div>

          <p className="mb-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <FaCalendarAlt aria-hidden="true" />
              {((exp as any)?.startDate ?? (exp as any)?.start ?? (exp as any)?.from) ?? strings.notInformed}
              {' — '}
              {((exp as any)?.endDate ?? (exp as any)?.end ?? (exp as any)?.to) ?? 'Atual'}
            </span>
          </p>

          {((exp as any)?.description) && (
            <p className="text-sm text-slate-700">{(exp as any).description}</p>
          )}
        </div>
      ))}
    </div>
  );
});
ExperienceSection.displayName = 'ExperienceSection';

interface FormationSectionProps {
  formations: Formation[];
}

const pick = (obj: unknown, keys: string[]): any => {
  const rec: any = obj as any;
  for (const k of keys) {
    if (rec && rec[k] != null && rec[k] !== '') return rec[k];
  }
  return undefined;
};

export const FormationSection = memo<FormationSectionProps>(({ formations }) => {
  if (!formations || formations.length === 0) {
    return (
      <EmptyState 
        icon={<FaUniversity className="h-8 w-8" />} 
        title="Nenhuma formação cadastrada" 
      />
    );
  }

  return (
    <div className="space-y-3">
      {formations.map((f, idx) => {
        const title = pick(f, ['course', 'title', 'name']) ?? strings.notInformed;
        const institution = pick(f, ['institution', 'school', 'university']);
        const level = pick(f, ['level', 'degree']);
        const start = pick(f, ['startDate', 'start', 'from']);
        const end = pick(f, ['endDate', 'end', 'to']) ?? 'Atual';

        return (
          <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FaGraduationCap className="h-5 w-5 text-slate-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{title}</p>
                  {(institution || level) && (
                    <p className="text-xs text-slate-500">
                      {institution ?? strings.notInformed}{level ? ` • ${level}` : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {(start || end) && (
              <p className="text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <FaCalendarAlt aria-hidden="true" />
                  {start ?? strings.notInformed} — {end}
                </span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
});
FormationSection.displayName = 'FormationSection';

// Lista simples de habilidades (somente visualização)
interface SkillsSectionProps {
  skills: string[];
}

export const SkillsSection = memo<SkillsSectionProps>(({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <EmptyState 
        icon={<FaTools className="h-8 w-8" />} 
        title="Nenhuma habilidade cadastrada" 
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-2" role="list">
      {skills.map((skill, idx) => (
        <span
          key={idx}
          className="cursor-default rounded-full border border-blue-200 bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 transition-all duration-200 hover:bg-blue-200 hover:shadow-sm"
          role="listitem"
        >
          {skill}
        </span>
      ))}
    </div>
  );
});
SkillsSection.displayName = 'SkillsSection';

// Card de documento
interface DocumentCardProps {
  fileName: string;
  fileUrl: string;
  isPdf: boolean;
  isMain?: boolean;
}

export const DocumentCard = memo<DocumentCardProps>(({ fileName, fileUrl, isPdf, isMain = false }) => (
  <div className={`flex items-center justify-between rounded-lg border p-3 transition-all duration-200 hover:shadow-md ${
    isMain 
      ? 'border-blue-200 bg-blue-50' 
      : 'border-slate-200 bg-white'
  }`}>
    <div className="flex items-center gap-3">
      <FaFileAlt className="h-5 w-5 text-slate-500" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-slate-800">{fileName}</p>
        <p className="text-xs text-slate-500">{isPdf ? 'PDF' : 'Arquivo'}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label={strings.viewDocumentButton}
      >
        <FaEye className="h-4 w-4" aria-hidden="true" />
        {strings.view}
      </a>
      <a
        href={fileUrl}
        download
        className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label={strings.downloadDocumentButton}
      >
        <FaDownload className="h-4 w-4" aria-hidden="true" />
        {strings.download}
      </a>
    </div>
  </div>
));
DocumentCard.displayName = 'DocumentCard';

// FocusTrap util
interface FocusTrapProps {
  isActive: boolean;
  children: React.ReactNode;
}

export const FocusTrap = memo<FocusTrapProps>(({ isActive, children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="radio"]:not([disabled])',
      'input[type="checkbox"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusable = Array.from(containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors));
    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey as any);
    return () => {
      document.removeEventListener('keydown', handleTabKey as any);
    };
  }, [isActive]);

  return <div ref={containerRef}>{children}</div>;
});
FocusTrap.displayName = 'FocusTrap';

// ==================== Skeleton Loader ====================

export const SkeletonLoader = memo(function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="h-36 w-full rounded-xl bg-slate-200" />
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-slate-100 rounded" />
            <div className="h-24 bg-slate-100 rounded" />
            <div className="h-24 bg-slate-100 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-slate-100 rounded" />
            <div className="h-32 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
});
SkeletonLoader.displayName = 'SkeletonLoader';
