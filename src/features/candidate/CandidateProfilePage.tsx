// src/features/candidate/CandidateProfilePage.tsx
// Versão adaptada seguindo o modelo avançado do EmployeeProfileViewPage
// Ajustes: paleta roxa unificada, banner com gradiente e texto interno, botão Voltar no banner,
// remoção de infos duplicadas da barra sticky e botão Editar alinhado na mesma linha das abas

import React, { useState, useCallback, memo, useEffect, useMemo, useRef } from 'react';
import {
  FaUserCircle, FaEdit, FaGraduationCap, FaBriefcase, FaTools, FaFileAlt,
  FaIdCard, FaEnvelope, FaPhone, FaTimes, FaUser, FaHome,
  FaCreditCard, FaTrash, FaArrowLeft, FaCheck, FaSpinner, FaCamera, FaHeart, FaUniversity, FaBuilding, FaPlus
} from 'react-icons/fa';

import { CandidateProfile, Experience, Formation } from './Candidate';
import {
  Card,
  SkeletonLoader,
  ToastContainer,
  EmptyState,
  SkillsSection,
  DocumentCard,
} from './CandidateComponents';
import {
  useProfileData,
  useToasts,
  useProfileTransforms,
  candidateUtils
} from './useCandidateHooks';

// ==================== COMPONENTS ====================

const SectionCard = memo(function SectionCard({
  title,
  subtitle,
  icon,
  badge,
  collapsible = false,
  isExpanded = true,
  onToggle,
  actions,
  children,
  variant = 'elevated'
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  collapsible?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'elevated' | 'flat';
}) {
  const cardClasses =
    variant === 'elevated'
      ? 'rounded-xl bg-white shadow-innova border border-primary/10 transition-all'
      : 'rounded-xl bg-white border border-primary/20';

  return (
    <div className={cardClasses}>
      <div className="border-b border-primary/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                {badge && (
                  <span className="innova-badge innova-badge-info">{badge}</span>
                )}
                {collapsible && (
                  <button
                    onClick={onToggle}
                    className="ml-1 rounded-md p-1 text-slate-400 hover:text-slate-600"
                    aria-label={isExpanded ? 'Recolher seção' : 'Expandir seção'}
                  >
                    <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      {(!collapsible || isExpanded) && <div className="px-6 py-4">{children}</div>}
    </div>
  );
});

const InputField = memo(function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon,
  required = false,
  multiline = false,
  rows = 3
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {icon && <span className="text-primary">{icon}</span>}
        {label}{required && '*'}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="input-innova resize-none"
          required={required}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-innova"
          required={required}
        />
      )}
    </div>
  );
});

// Botão alinhado à paleta/tokens
const Button = memo(function Button({
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  children,
  fullWidth = false
}: {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  const base = 'inline-flex items-center gap-2 rounded-lg font-semibold transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary: 'btn-innova btn-innova-primary',
    secondary: 'btn-innova btn-innova-secondary',
    success: 'bg-success text-white hover:brightness-95 px-4 py-2',
    danger: 'bg-danger text-white hover:brightness-95 px-4 py-2',
    ghost: 'text-slate-600 hover:bg-slate-100 px-4 py-2'
  };
  const sizes: Record<string, string> = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full justify-center' : ''}`}
    >
      {loading ? <FaSpinner className="animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
});

// ===== Banner/Header =====
const ProfileHeader: React.FC<{
  profile: CandidateProfile;
  displayName: string;
  displayEmail: string;
  displayPhone: string;
  onEditProfile: () => void; // reutilizamos para "Editar banner"
}> = ({ profile, displayName, displayEmail, displayPhone, onEditProfile }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/10 shadow-innova bg-white">
      {/* Faixa roxa (altura maior e conteúdo dentro da faixa) */}
      <div
        className="relative innova-gradient h-52 md:h-56 w-full animate-gradientShift bg-[length:200%_200%] rounded-t-2xl"
        role="img"
        aria-label="Capa do perfil"
      >
        {/* Botão Voltar (esquerda) */}
        <div className="absolute left-4 top-4">
          <Button
            onClick={() => window.history.back()}
            variant="secondary"
            size="sm"
            icon={<FaArrowLeft aria-hidden="true" />}
          >
            Voltar
          </Button>
        </div>

        {/* Botão Editar banner (direita) */}
        <div className="absolute right-4 top-4">
          <Button
            onClick={onEditProfile}
            variant="secondary"
            size="sm"
            icon={<FaCamera aria-hidden="true" />}
          >
            Editar banner
          </Button>
        </div>

        {/* Conteúdo dentro da faixa */}
        <div className="absolute inset-0 flex items=end">
          <div className="flex w-full items-end gap-4 px-6 pb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-white bg-slate-200 shadow-md overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <FaUserCircle className="h-full w-full text-slate-400" aria-hidden="true" />
                )}
              </div>
              <span
                className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-success border-2 border-white"
                aria-hidden="true"
              />
            </div>

            {/* Nome/cargo e meta dentro da faixa roxa */}
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                {displayName || '—'}
              </h1>
              <p className="text-sm md:text-base text-white/90 font-medium">
                {profile.jobTitle || 'Candidato'}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm text-white/90">
                <span className="inline-flex items-center gap-2">
                  <FaEnvelope className="opacity-90" aria-hidden="true" />
                  <span>{displayEmail}</span>
                </span>
                {displayPhone && (
                  <span className="inline-flex items-center gap-2">
                    <FaPhone className="opacity-90" aria-hidden="true" />
                    <span>{candidateUtils.formatPhone(displayPhone)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* base branca apenas para a sombra e o raio inferior */}
      <div className="h-6 rounded-b-2xl bg-white" />
    </div>
  );
};

// ===== Itens =====
const ExperienceItem = memo(function ExperienceItem({
  experience,
  index,
  isEditing,
  onUpdate,
  onRemove,
}: {
  experience: Experience;
  index: number;
  isEditing: boolean;
  onUpdate: (experience: Experience) => void;
  onRemove: () => void;
}) {
  if (!isEditing) {
    return (
      <div className="border-l-4 border-primary py-3 pl-4 rounded-r-lg hover:bg-primary/5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h4 className="font-semibold text-slate-800 text-base">{experience.role}</h4>
          <span className="innova-badge innova-badge-info">{`${experience.startDate} - ${experience.endDate}`}</span>
        </div>
        {experience.company && (
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <FaBuilding className="h-3 w-3" aria-hidden="true" />
            <span>{experience.company}</span>
          </div>
        )}
        {experience.description && <p className="text-sm text-slate-700">{experience.description}</p>}
      </div>
    );
  }

  return (
    <div className="border border-primary/15 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-slate-800">Experiência #{index + 1}</h4>
        <Button onClick={onRemove} variant="danger" size="sm" icon={<FaTrash aria-hidden="true" />}>
          Remover
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField
          label="Cargo"
          value={experience.role}
          onChange={(value) => onUpdate({ ...experience, role: value })}
          placeholder="Ex: Desenvolvedor Frontend"
          required
        />
        <InputField
          label="Empresa"
          value={experience.company || ''}
          onChange={(value) => onUpdate({ ...experience, company: value })}
          placeholder="Ex: Tech Solutions"
        />
        <InputField
          label="Data de Início"
          value={experience.startDate}
          onChange={(value) => onUpdate({ ...experience, startDate: value })}
          placeholder="Ex: Jan 2023"
          required
        />
        <InputField
          label="Data de Fim"
          value={experience.endDate}
          onChange={(value) => onUpdate({ ...experience, endDate: value })}
          placeholder="Ex: Atual"
          required
        />
      </div>
      <InputField
        label="Descrição"
        value={experience.description || ''}
        onChange={(value) => onUpdate({ ...experience, description: value })}
        placeholder="Descreva suas responsabilidades e conquistas..."
        multiline
        rows={3}
      />
    </div>
  );
});

const FormationItem = memo(function FormationItem({
  formation,
  index,
  isEditing,
  onUpdate,
  onRemove,
}: {
  formation: Formation;
  index: number;
  isEditing: boolean;
  onUpdate: (formation: Formation) => void;
  onRemove: () => void;
}) {
  if (!isEditing) {
    return (
      <div className="border border-primary/15 rounded-lg p-4 hover:border-primary/30 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
          <h4 className="font-semibold text-slate-800">{formation.degree}</h4>
          <span className="innova-badge innova-badge-info">{formation.graduationDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FaUniversity className="h-3 w-3" aria-hidden="true" />
          <span>{formation.institution}</span>
        </div>
        {formation.description && <p className="text-sm text-slate-700 mt-2">{formation.description}</p>}
      </div>
    );
  }

  return (
    <div className="border border-primary/15 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-slate-800">Formação #{index + 1}</h4>
        <Button onClick={onRemove} variant="danger" size="sm" icon={<FaTrash aria-hidden="true" />}>
          Remover
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField
          label="Curso/Grau"
          value={formation.degree}
          onChange={(value) => onUpdate({ ...formation, degree: value })}
          placeholder="Ex: Bacharel em Ciência da Computação"
          required
        />
        <InputField
          label="Instituição"
          value={formation.institution}
          onChange={(value) => onUpdate({ ...formation, institution: value })}
          placeholder="Ex: Universidade de Brasília"
          required
        />
        <InputField
          label="Data de Conclusão"
          value={formation.graduationDate}
          onChange={(value) => onUpdate({ ...formation, graduationDate: value })}
          placeholder="Ex: 12/2023"
          required
        />
      </div>

      <InputField
        label="Descrição (opcional)"
        value={formation.description || ''}
        onChange={(value) => onUpdate({ ...formation, description: value })}
        placeholder="Descreva detalhes relevantes sobre a formação..."
        multiline
        rows={2}
      />
    </div>
  );
});

const SkillsEditor = memo(function SkillsEditor({
  skills,
  onUpdate,
}: {
  skills: string[];
  onUpdate: (skills: string[]) => void;
}) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = useCallback(() => {
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {
      onUpdate([...skills, skill]);
      setNewSkill('');
    }
  }, [newSkill, skills, onUpdate]);

  const removeSkill = useCallback((skillToRemove: string) => {
    onUpdate(skills.filter(skill => skill !== skillToRemove));
  }, [skills, onUpdate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="rounded-full p-1 hover:bg-primary/10"
              aria-label={`Remover ${skill}`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 8.586L3.707 2.293 2.293 3.707 8.586 10l-6.293 6.293 1.414 1.414L10 11.414l6.293 6.293 1.414-1.414L11.414 10l6.293-6.293-1.414-1.414L10 8.586z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Adicionar habilidade..."
          className="input-innova flex-1"
        />
        <Button onClick={addSkill} variant="primary" size="sm" icon={<FaPlus aria-hidden="true" />}>
          Adicionar
        </Button>
      </div>
    </div>
  );
});

const DataDisplay = memo(function DataDisplay({
  label,
  value,
  icon,
  prefix,
  suffix
}: {
  label: string;
  value: any;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-sm text-slate-400">{icon}</span>}
        <span className="text-sm font-medium text-slate-600">{label}:</span>
      </div>
      <p className={`text-sm text-slate-900 ${icon ? 'pl-6' : ''}`}>
        {prefix}{value || '-'}{suffix}
      </p>
    </div>
  );
});

// ==================== MAIN COMPONENT ====================

const CandidateProfilePage: React.FC = () => {
  const { profile, isLoading, updateProfile, error } = useProfileData();
  const { toasts, showToast } = useToasts();
  const transforms = useProfileTransforms(profile);

  const [isEditing, setIsEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTabId, setActiveTabId] = useState('dados-pessoais');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [expandedSections, setExpandedSections] = useState({
    pessoais: true,
    endereco: true,
    bancarios: true,
    formacao: true,
    experiencia: true,
    dependentes: false,
    contatos: false,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [tabTransition, setTabTransition] = useState(false);

  const draftKey = useMemo(() => {
    const idish = transforms.displayEmail || transforms.displayName || 'candidate';
    return `draft_candidate_${idish}`;
  }, [transforms.displayEmail, transforms.displayName]);

  // Autosave
  useEffect(() => {
    if (!profile || !dirty || !isEditing) return;
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(profile));
        setLastSaved(new Date());
        showToast('Rascunho salvo automaticamente', 'info');
      } catch (error) {
        console.error('Erro ao salvar rascunho:', error);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [profile, dirty, isEditing, draftKey, showToast]);

  const navigateToTab = useCallback((tabId: string) => {
    if (tabId === activeTabId) return;
    setTabTransition(true);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setActiveTabId(tabId);
      setTabTransition(false);
    }, 150);
  }, [activeTabId]);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleUpdateProfile = useCallback((field: keyof CandidateProfile, value: any) => {
    if (!profile) return;
    updateProfile({ [field]: value });
    setDirty(true);
  }, [profile, updateProfile]);

  const getRegistrationField = useCallback((key: string): string => {
    const registration = JSON.parse(localStorage.getItem('candidateRegistrationData') || '{}');
    return registration[key] || '';
  }, []);

  const handleSave = useCallback(async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.removeItem(draftKey);
      setDirty(false);
      setIsEditing(false);
      showToast('Alterações salvas com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showToast('Erro ao salvar alterações.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [profile, draftKey, showToast]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setDirty(false);
    localStorage.removeItem(draftKey);
  }, [draftKey]);

  const addExperience = useCallback(() => {
    if (!profile) return;
    const newExperience: Experience = { role: '', company: '', startDate: '', endDate: '', description: '' };
    handleUpdateProfile('experiences', [...(profile.experiences || []), newExperience]);
  }, [profile, handleUpdateProfile]);

  const addFormation = useCallback(() => {
    if (!profile) return;
    const newFormation: Formation = { degree: '', institution: '', graduationDate: '', description: '' };
    handleUpdateProfile('formation', [...(profile.formation || []), newFormation]);
  }, [profile, handleUpdateProfile]);

  const normalizedSkills: string[] = useMemo(() => {
    const raw = (profile?.skills ?? []) as any[];
    return raw.map((s) => (typeof s === 'string' ? s : (s?.name ?? ''))).filter(Boolean);
  }, [profile]);

  const normalizedDocuments = useMemo(() => {
    const docs = (profile?.documents ?? []) as Array<string | { fileName: string; fileUrl: string; isPdf: boolean }>;
    return docs.map((doc, idx) =>
      typeof doc === 'string'
        ? { fileName: doc.split('/').pop() || doc, fileUrl: doc, isPdf: doc.toLowerCase().endsWith('.pdf'), isMain: idx === 0 }
        : { ...(doc as any), isMain: idx === 0 }
    );
  }, [profile]);

  const tabs = useMemo(() => ([
    { id: 'dados-pessoais', label: 'Dados Pessoais', icon: <FaUser className="text-sm" aria-hidden="true" /> },
    { id: 'formacao-experiencia', label: 'Formação & Experiência', icon: <FaGraduationCap className="text-sm" aria-hidden="true" /> },
    { id: 'habilidades', label: 'Habilidades', icon: <FaTools className="text-sm" aria-hidden="true" /> },
    { id: 'documentos', label: 'Documentos', icon: <FaFileAlt className="text-sm" aria-hidden="true" /> },
    { id: 'dados-registro', label: 'Dados de Registro', icon: <FaIdCard className="text-sm" aria-hidden="true" /> },
  ]), []);

  const renderTabContent = () => {
    if (!profile) return null;

    switch (activeTabId) {
      case 'dados-pessoais':
        return (
          <div className="space-y-6">
            <SectionCard
              title="Informações Básicas"
              subtitle="Dados principais do candidato"
              icon={<FaUser aria-hidden="true" />}
              collapsible
              isExpanded={expandedSections.pessoais}
              onToggle={() => toggleSection('pessoais')}
            >
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Nome Completo"
                    value={transforms.displayName}
                    onChange={(value) => handleUpdateProfile('name', value)}
                    icon={<FaUser aria-hidden="true" />}
                    required
                  />
                  <InputField
                    label="E-mail"
                    value={transforms.displayEmail}
                    onChange={(value) => handleUpdateProfile('email', value)}
                    type="email"
                    icon={<FaEnvelope aria-hidden="true" />}
                    required
                  />
                  <InputField
                    label="Telefone"
                    value={transforms.displayPhone}
                    onChange={(value) => handleUpdateProfile('phone', value)}
                    icon={<FaPhone aria-hidden="true" />}
                    required
                  />
                  <InputField
                    label="Cargo Desejado"
                    value={profile.jobTitle || ''}
                    onChange={(value) => handleUpdateProfile('jobTitle', value)}
                    icon={<FaBriefcase aria-hidden="true" />}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DataDisplay label="Nome Completo" value={transforms.displayName} icon={<FaUser aria-hidden="true" />} />
                  <DataDisplay label="E-mail" value={transforms.displayEmail} icon={<FaEnvelope aria-hidden="true" />} />
                  <DataDisplay label="Telefone" value={candidateUtils.formatPhone(transforms.displayPhone)} icon={<FaPhone aria-hidden="true" />} />
                  <DataDisplay label="Cargo Desejado" value={profile.jobTitle} icon={<FaBriefcase aria-hidden="true" />} />
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Sobre Mim"
              subtitle="Apresentação pessoal"
              icon={<FaHeart aria-hidden="true" />}
            >
              {isEditing ? (
                <InputField
                  label="Descrição"
                  value={profile.jobSummary || ''}
                  onChange={(value) => handleUpdateProfile('jobSummary', value)}
                  placeholder="Fale um pouco sobre você, seus objetivos profissionais..."
                  multiline
                  rows={4}
                />
              ) : (
                <p className="text-sm text-slate-700">
                  {profile.jobSummary || 'Nenhuma descrição fornecida.'}
                </p>
              )}
            </SectionCard>
          </div>
        );

      case 'formacao-experiencia':
        return (
          <div className="space-y-6">
            <SectionCard
              title="Formação Acadêmica"
              subtitle={`${(profile.formation || []).length} formação(ões) cadastrada(s)`}
              icon={<FaGraduationCap aria-hidden="true" />}
              badge={(profile.formation || []).length}
              collapsible
              isExpanded={expandedSections.formacao}
              onToggle={() => toggleSection('formacao')}
            >
              <div className="space-y-4">
                {(profile.formation || []).map((item, idx) => (
                  <FormationItem
                    key={idx}
                    formation={item}
                    index={idx}
                    isEditing={isEditing}
                    onUpdate={(updatedFormation) => {
                      const newFormation = [...(profile.formation || [])];
                      newFormation[idx] = updatedFormation;
                      handleUpdateProfile('formation', newFormation);
                    }}
                    onRemove={() => {
                      const newFormation = (profile.formation || []).filter((_, i) => i !== idx);
                      handleUpdateProfile('formation', newFormation);
                    }}
                  />
                ))}

                {isEditing && (
                  <button
                    onClick={addFormation}
                    className="w-full p-4 border-2 border-dashed border-primary/30 rounded-lg text-primary bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <FaPlus className="h-4 w-4 mx-auto mb-2" aria-hidden="true" />
                    Adicionar Formação
                  </button>
                )}

                {!(profile.formation && profile.formation.length) && !isEditing && (
                  <EmptyState icon={<FaGraduationCap className="h-8 w-8" aria-hidden="true" />} title="Nenhuma formação cadastrada" />
                )}
              </div>
            </SectionCard>

            <SectionCard
              title="Experiências Profissionais"
              subtitle={`${(profile.experiences || []).length} experiência(s) cadastrada(s)`}
              icon={<FaBriefcase aria-hidden="true" />}
              badge={(profile.experiences || []).length}
              collapsible
              isExpanded={expandedSections.experiencia}
              onToggle={() => toggleSection('experiencia')}
            >
              <div className="space-y-4">
                {(profile.experiences || []).map((item, idx) => (
                  <ExperienceItem
                    key={idx}
                    experience={item}
                    index={idx}
                    isEditing={isEditing}
                    onUpdate={(updatedExperience) => {
                      const newExperiences = [...(profile.experiences || [])];
                      newExperiences[idx] = updatedExperience;
                      handleUpdateProfile('experiences', newExperiences);
                    }}
                    onRemove={() => {
                      const newExperiences = (profile.experiences || []).filter((_, i) => i !== idx);
                      handleUpdateProfile('experiences', newExperiences);
                    }}
                  />
                ))}

                {isEditing && (
                  <button
                    onClick={addExperience}
                    className="w-full p-4 border-2 border-dashed border-primary/30 rounded-lg text-primary bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <FaPlus className="h-4 w-4 mx-auto mb-2" aria-hidden="true" />
                    Adicionar Experiência
                  </button>
                )}

                {!(profile.experiences && profile.experiences.length) && !isEditing && (
                  <EmptyState icon={<FaBriefcase className="h-8 w-8" aria-hidden="true" />} title="Nenhuma experiência cadastrada" />
                )}
              </div>
            </SectionCard>
          </div>
        );

      case 'habilidades':
        return (
          <div className="space-y-6">
            <SectionCard
              title="Habilidades Técnicas e Pessoais"
              subtitle={`${normalizedSkills.length} habilidade(s) cadastrada(s)`}
              icon={<FaTools aria-hidden="true" />}
              badge={normalizedSkills.length}
            >
              {isEditing ? (
                <SkillsEditor
                  skills={normalizedSkills}
                  onUpdate={(skills) => handleUpdateProfile('skills', skills)}
                />
              ) : normalizedSkills.length ? (
                <SkillsSection skills={normalizedSkills} />
              ) : (
                <EmptyState icon={<FaTools className="h-8 w-8" aria-hidden="true" />} title="Nenhuma habilidade cadastrada" />
              )}
            </SectionCard>
          </div>
        );

      case 'documentos':
        return (
          <div className="space-y-6">
            <SectionCard
              title="Documentos Anexados"
              subtitle={`${normalizedDocuments.length} documento(s) anexado(s)`}
              icon={<FaFileAlt aria-hidden="true" />}
              badge={normalizedDocuments.length}
            >
              <div className="space-y-3">
                {normalizedDocuments.length ? (
                  normalizedDocuments.map((doc: any, idx: number) => (
                    <DocumentCard
                      key={idx}
                      fileName={doc.fileName}
                      fileUrl={doc.fileUrl}
                      isPdf={doc.isPdf}
                      isMain={doc.isMain}
                    />
                  ))
                ) : (
                  <EmptyState icon={<FaFileAlt className="h-8 w-8" aria-hidden="true" />} title="Nenhum documento anexado" />
                )}
              </div>
            </SectionCard>
          </div>
        );

      case 'dados-registro':
        return (
          <div className="space-y-6">
            <SectionCard
              title="Informações de Registro"
              subtitle="Dados coletados durante o cadastro"
              icon={<FaIdCard aria-hidden="true" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DataDisplay label="CPF" value={candidateUtils.formatCPF(getRegistrationField('cpf'))} />
                <DataDisplay label="Sexo" value={getRegistrationField('sexo')} />
                <DataDisplay label="PIS" value={getRegistrationField('pis')} />
                <DataDisplay label="Menor de Idade" value={getRegistrationField('menorIdade') === 'sim' ? 'Sim' : 'Não'} />
                {getRegistrationField('sexo')?.toLowerCase() === 'masculino' && (
                  <DataDisplay label="Certificado de Reservista" value={getRegistrationField('certReservista')} />
                )}
              </div>
            </SectionCard>

            <SectionCard
              title="Endereço"
              subtitle="Localização do candidato"
              icon={<FaHome aria-hidden="true" />}
              collapsible
              isExpanded={expandedSections.endereco}
              onToggle={() => toggleSection('endereco')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DataDisplay label="CEP" value={candidateUtils.formatCEP(getRegistrationField('cep'))} />
                <DataDisplay label="Rua" value={getRegistrationField('enderecoRua')} />
                <DataDisplay label="Número" value={getRegistrationField('enderecoNumero')} />
                <DataDisplay label="Bairro" value={getRegistrationField('enderecoBairro')} />
                <DataDisplay label="Cidade" value={getRegistrationField('enderecoCidade')} />
                <DataDisplay label="Estado" value={getRegistrationField('enderecoEstado')} />
              </div>
            </SectionCard>

            <SectionCard
              title="Dados Bancários"
              subtitle="Informações para pagamento"
              icon={<FaCreditCard aria-hidden="true" />}
              collapsible
              isExpanded={expandedSections.bancarios}
              onToggle={() => toggleSection('bancarios')}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DataDisplay label="Banco" value={getRegistrationField('banco')} />
                <DataDisplay label="Agência" value={getRegistrationField('agencia')} />
                <DataDisplay label="Conta" value={getRegistrationField('conta')} />
              </div>
            </SectionCard>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) return <SkeletonLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-primary-subtle flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <svg className="h-12 w-12 text-danger mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 5v7h-1.5V7h1.5zm0 9v2h-1.5v-2h1.5z" />
          </svg>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Erro ao carregar perfil</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">Tentar novamente</Button>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  const { displayName, displayEmail, displayPhone } = transforms;

  return (
    <div className="min-h-screen bg-gradient-primary-subtle">
      <ToastContainer toasts={toasts} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Banner do Candidato com botão Voltar embutido */}
        <ProfileHeader
          profile={profile}
          displayName={displayName}
          displayEmail={displayEmail}
          displayPhone={displayPhone}
          onEditProfile={() => setIsEditing(true)}
        />

        {/* Barra sticky: somente abas à esquerda e botões à direita (sem repetir nome/email) */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 mt-4 mb-4 border-b border-primary/10 bg-white/85 px-4 sm:px-6 lg:px-8 py-3 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Nav de seções */}
            <nav className="mt-0 flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigateToTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    activeTabId === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                  }`}
                  role="tab"
                  aria-selected={activeTabId === tab.id}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {dirty && isEditing && activeTabId === tab.id && (
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-warning" aria-hidden="true" />
                  )}
                </button>
              ))}
            </nav>

            {/* Ações: Edit/Salvar/Cancelar na MESMA linha das abas */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="secondary"
                    size="sm"
                    icon={<FaTimes aria-hidden="true" />}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="primary"
                    size="sm"
                    icon={isSaving ? <FaSpinner aria-hidden="true" /> : <FaCheck aria-hidden="true" />}
                    disabled={isSaving}
                    loading={isSaving}
                  >
                    {isSaving ? 'Salvando...' : 'Salvar alterações'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="primary"
                  size="sm"
                  icon={<FaEdit aria-hidden="true" />}
                >
                  Editar perfil
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo das abas */}
        <div
          ref={scrollContainerRef}
          className={`${tabTransition ? 'opacity-50' : 'opacity-100'} transition-opacity`}
        >
          {renderTabContent()}
        </div>

        {/* Barra de status */}
        <div className="mt-6 flex items-center justify-between px-1 text-xs text-slate-500">
          {isEditing && (
            <span className={`flex items-center gap-1 ${dirty ? 'text-warning' : 'text-success'}`}>
              <span className={`h-2 w-2 rounded-full ${dirty ? 'bg-warning' : 'bg-success'}`} aria-hidden="true" />
              {dirty ? 'Não salvo' : 'Salvo'}
            </span>
          )}
          {lastSaved && (
            <span>
              Último rascunho: {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
