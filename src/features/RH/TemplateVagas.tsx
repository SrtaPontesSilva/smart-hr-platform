import React, { useEffect, useMemo, useState, useRef } from 'react';
import { 
  FaCopy, FaMagic, FaDownload, FaStickyNote, FaHashtag, FaBuilding,
  FaUser, FaMapMarkerAlt, FaClipboardList, FaLinkedin, FaFileAlt,
  FaBolt, FaPlus, FaEdit, FaTrash, FaTimes, FaSave,
  FaChevronRight, FaEye, FaCog, FaArchive, FaClock
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

import PageHeader from '../../layout/RH/PageHeader';

// ==========================================================
// RH – Studio de Templates de Vagas - Interface Melhorada
// Melhor organização, navegação por seções, suporte completo ao dark mode
// Seção de modelos salvos e botão de salvar adicionados
// ==========================================================

export type VagaForm = {
  cargo: string;
  senioridade: 'Estágio' | 'Júnior' | 'Pleno' | 'Sênior' | 'Líder' | 'Especialista' | '';
  area: 'Tecnologia' | 'Produto' | 'Design' | 'Marketing' | 'Vendas' | 'Operações' | 'RH' | 'Financeiro' | 'Jurídico' | '';
  modeloTrabalho: 'Presencial' | 'Remoto' | 'Híbrido' | '';
  cidade: string;
  estadoPais: string;
  tipoContrato: 'CLT' | 'PJ' | 'Temporário' | 'Freelancer' | 'Estágio' | '';
  faixaSalarial: string;
  beneficios: string;
  responsabilidades: string;
  requisitosMust: string;
  requisitosNice: string;
  sobreEmpresa: string;
  linkCandidatura: string;
  prazo: string;
  prazoDate?: string;
  diversidade: boolean;
  tom: 'Direto' | 'Empolgante' | 'Formal' | 'Amigável';
  idioma: 'pt' | 'en';
};

// Tipo para armazenar modelos salvos
type SavedTemplate = {
  id: string;
  nome: string;
  cargo: string;
  area: VagaForm['area'];   // ✅ corrigido
  data: string;
  conteudoMarkdown: string;
  conteudoLinkedIn: string;
  formulario: VagaForm;
};

type PresetData = {
  label: string;
  hint: string;
  area: VagaForm['area'];
  responsabilidades: string;
  requisitosMust: string;
  requisitosNice: string;
};

type Preset = PresetData & {
  id: string;
  isCustom: boolean;
};

type Section = 'presets' | 'basicas' | 'localizacao' | 'conteudo' | 'configuracoes' | 'preview' | 'saved';

const defaultForm: VagaForm = {
  cargo: '',
  senioridade: '',
  area: '',
  modeloTrabalho: '',
  cidade: '',
  estadoPais: '',
  tipoContrato: '',
  faixaSalarial: '',
  beneficios: '',
  responsabilidades: '',
  requisitosMust: '',
  requisitosNice: '',
  sobreEmpresa: '',
  linkCandidatura: '',
  prazo: '',
  prazoDate: undefined,
  diversidade: true,
  tom: 'Direto',
  idioma: 'pt',
};

const builtinPresetsData: PresetData[] = [
  {
    label: 'Desenvolvedor Backend',
    hint: 'APIs, cloud, arquitetura',
    area: 'Tecnologia',
    responsabilidades: [
      'Desenvolver e manter APIs REST/GraphQL robustas e escaláveis',
      'Implementar testes automatizados (unitários, integração e end-to-end)',
      'Colaborar com DevOps para otimizar CI/CD e observabilidade',
      'Participar de code reviews e definições arquiteturais'
    ].join('\n'),
    requisitosMust: [
      'Experiência sólida com Node.js ou Python (Django/FastAPI)',
      'Domínio de bancos relacionais (PostgreSQL) e versionamento (Git)',
      'Conhecimento prático de cloud computing (AWS/GCP/Azure)',
      'Experiência com desenvolvimento de APIs e microsserviços'
    ].join('\n'),
    requisitosNice: [
      'Conhecimento em mensageria (Kafka/RabbitMQ)',
      'Experiência com contêineres (Docker) e orquestração (Kubernetes)',
      'Vivência com metodologias ágeis (Scrum/Kanban)'
    ].join('\n'),
  },
  {
    label: 'Product Manager',
    hint: 'Discovery, roadmap, métricas',
    area: 'Produto',
    responsabilidades: [
      'Definir e priorizar roadmap de produto baseado em dados e impacto',
      'Conduzir descoberta de produto com usuários e stakeholders',
      'Estabelecer e acompanhar KPIs e métricas de sucesso',
      'Facilitar alinhamento entre equipes de produto, design e engenharia'
    ].join('\n'),
    requisitosMust: [
      'Experiência comprovada como Product Manager em produtos digitais',
      'Habilidades analíticas e de interpretação de dados',
      'Experiência com frameworks de priorização e roadmap',
      'Excelente comunicação e capacidade de influenciar stakeholders'
    ].join('\n'),
    requisitosNice: [
      'Conhecimento de SQL e ferramentas de BI',
      'Experiência com growth hacking e funil AARRR',
      'Certificações em metodologias de produto'
    ].join('\n'),
  },
  {
    label: 'Product Designer',
    hint: 'UX/UI, pesquisa, prototipação',
    area: 'Design',
    responsabilidades: [
      'Conduzir pesquisas de usuário e testes de usabilidade',
      'Criar wireframes, protótipos e interfaces no Figma',
      'Desenvolver e manter design system e componentes',
      'Colaborar estreitamente com Product e Engenharia'
    ].join('\n'),
    requisitosMust: [
      'Portfólio sólido com cases de UX/UI end-to-end',
      'Domínio de ferramentas de design (Figma, Sketch)',
      'Conhecimento de heurísticas de usabilidade e design system',
      'Experiência com prototipação e handoff para desenvolvimento'
    ].join('\n'),
    requisitosNice: [
      'Conhecimento em acessibilidade (WCAG) e design inclusivo',
      'Experiência com métricas de produto e análise comportamental',
      'Conhecimentos básicos de front-end (HTML/CSS)'
    ].join('\n'),
  },
];

const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'presets', label: 'Presets', icon: <FaMagic /> },
  { id: 'basicas', label: 'Informações Básicas', icon: <FaBuilding /> },
  { id: 'localizacao', label: 'Localização', icon: <FaMapMarkerAlt /> },
  { id: 'conteudo', label: 'Conteúdo', icon: <FaClipboardList /> },
  { id: 'configuracoes', label: 'Configurações', icon: <FaCog /> },
  { id: 'preview', label: 'Preview', icon: <FaEye /> },
  { id: 'saved', label: 'Modelos Salvos', icon: <FaArchive /> },
];

const getIconForArea = (area: VagaForm['area']) => {
  switch (area) {
    case 'Tecnologia': return <FaBolt className="text-primary-500" />;
    case 'Produto': return <FaClipboardList className="text-primary-500" />;
    case 'Design': return <FaUser className="text-primary-500" />;
    case 'Marketing': return <FaHashtag className="text-primary-500" />;
    case 'Vendas': return <FaHashtag className="text-primary-500" />;
    case 'Operações': return <FaBuilding className="text-primary-500" />;
    case 'RH': return <FaBuilding className="text-primary-500" />;
    case 'Financeiro': return <FaBuilding className="text-primary-500" />;
    case 'Jurídico': return <FaBuilding className="text-primary-500" />;
    default: return <FaStickyNote className="text-primary-500" />;
  }
};

// ================================
// Utilities
// ================================
const toLines = (s: string) => s.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

const buildHashTags = (f: VagaForm): string[] => {
  const tags = new Set<string>();
  tags.add('Vagas');
  if (f.area) tags.add(f.area);
  if (f.senioridade) tags.add(f.senioridade);
  if (f.modeloTrabalho) tags.add(f.modeloTrabalho);
  if (f.cidade) tags.add(f.cidade.replace(/\s+/g, ''));
  if (f.estadoPais) tags.add(f.estadoPais.replace(/\s+/g, ''));
  if (f.area === 'Tecnologia') tags.add('Tech');
  tags.add('Hiring');
  tags.add('Oportunidade');
  return Array.from(tags).slice(0, 8).map(t => `#${t}`);
};

const pickTone = (tom: VagaForm['tom']) => {
  switch (tom) {
    case 'Empolgante':
      return {
        hook: (cargo: string) => `🚀 Estamos crescendo e procurando ${cargo} para elevar nosso produto!`,
        closing: 'Curtiu? Compartilhe com sua rede 💜',
      };
    case 'Formal':
      return {
        hook: (cargo: string) => `Estamos com processo seletivo aberto para ${cargo}.`,
        closing: 'Agradecemos o interesse e aguardamos sua candidatura.',
      };
    case 'Amigável':
      return {
        hook: (cargo: string) => `Ei, pessoal! Procuramos ${cargo} para somar ao time 🙂`,
        closing: 'Conhece alguém? Marca aqui nos comentários!',
      };
    default:
      return {
        hook: (cargo: string) => `Estamos contratando: ${cargo}.`,
        closing: 'Candidate-se pelo link acima.',
      };
  }
};

const formatDateBR = (iso?: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
};

const formatDateTimeBR = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const buildTemplate = (f: VagaForm) => {
  const must = toLines(f.requisitosMust);
  const nice = toLines(f.requisitosNice);
  const resp = toLines(f.responsabilidades);
  const bens = toLines(f.beneficios);

  const headerLocal = [f.modeloTrabalho, [f.cidade, f.estadoPais].filter(Boolean).join(' – ')].filter(Boolean).join(' • ');
  const prazoFmt = f.prazoDate ? formatDateBR(f.prazoDate) : (f.prazo || '');

  return [
    `# ${f.cargo}${f.senioridade ? ` (${f.senioridade})` : ''}`,
    headerLocal ? `**Local/Modelo:** ${headerLocal}` : '',
    f.tipoContrato ? `**Contrato:** ${f.tipoContrato}` : '',
    f.faixaSalarial ? `**Faixa salarial:** ${f.faixaSalarial}` : '',
    '',
    f.sobreEmpresa ? `## Sobre a empresa\n${f.sobreEmpresa}` : '',
    resp.length ? `## Responsabilidades\n${resp.map(i => `• ${i}`).join('\n')}` : '',
    must.length ? `## Requisitos (Must-have)\n${must.map(i => `• ${i}`).join('\n')}` : '',
    nice.length ? `## Diferenciais (Nice-to-have)\n${nice.map(i => `• ${i}`).join('\n')}` : '',
    bens.length ? `## Benefícios\n${bens.map(i => `• ${i}`).join('\n')}` : '',
    prazoFmt ? `**Prazo para candidaturas:** ${prazoFmt}` : '',
    f.linkCandidatura ? `**Como se candidatar:** ${f.linkCandidatura}` : '',
    f.diversidade ? `\n> Valorizamos a diversidade e encorajamos candidaturas de pessoas de todos os perfis. ♿🏳️‍🌈🧡` : '',
  ].filter(Boolean).join('\n\n');
};

const buildLinkedIn = (f: VagaForm) => {
  const tone = pickTone(f.tom);
  const local = [f.modeloTrabalho, [f.cidade, f.estadoPais].filter(Boolean).join(' – ')].filter(Boolean).join(' • ');
  const tags = buildHashTags(f).join(' ');
  const prazoFmt = f.prazoDate ? formatDateBR(f.prazoDate) : (f.prazo || '');

  const lines = [
    tone.hook(`${f.cargo}${f.senioridade ? ` (${f.senioridade})` : ''}`),
    f.area ? `Área: ${f.area}` : '',
    local ? `📍 ${local}` : '',
    f.tipoContrato ? `📄 ${f.tipoContrato}${f.faixaSalarial ? ` • ${f.faixaSalarial}` : ''}` : (f.faixaSalarial ? `💰 ${f.faixaSalarial}` : ''),
    f.requisitosMust ? `✅ Must-have: ${toLines(f.requisitosMust).slice(0,3).join(' • ')}` : '',
    prazoFmt ? `⏰ Prazo: ${prazoFmt}` : '',
    f.linkCandidatura ? `🔗 Inscreva-se: ${f.linkCandidatura}` : '',
    tone.closing,
    tags,
  ].filter(Boolean);

  const txt = lines.join('\n');
  const maxLen = 1200;
  return txt.length > maxLen ? `${txt.slice(0, maxLen - 1)}…` : txt;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement('textarea');
    el.value = text; 
    document.body.appendChild(el); 
    el.select(); 
    document.execCommand('copy'); 
    document.body.removeChild(el);
  }
};

const downloadTxt = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; 
  a.download = filename; 
  a.click();
  URL.revokeObjectURL(url);
};

const makeId = () => Math.random().toString(36).slice(2, 10);

// ================================
// Components Melhorados
// ================================
const Card: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, icon, children, actions, className = '' }) => (
  <div className={`
    bg-white dark:bg-slate-800 
    border border-slate-200 dark:border-slate-700 
    rounded-xl shadow-sm dark:shadow-innova 
    transition-all duration-200 hover:shadow-md dark:hover:shadow-innova-md
    ${className}
  `}>
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-primary-500 dark:text-primary-400">
            {icon ?? <FaStickyNote />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  </div>
);

const FormSection: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, children, className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h4>
      {subtitle && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}> = ({ label, children, hint, required }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
      {required && <span className="ml-1 text-danger-500">*</span>}
    </label>
    {children}
    {hint && (
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {hint}
      </p>
    )}
  </div>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
(props, ref) => (
<input
ref={ref}
{...props}
className={`w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all duration-150 ${props.className ?? ''}`}
/>
)
);
Input.displayName = 'Input';

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => (
  <select
    {...props}
    className={`
      w-full px-3 py-2.5 
      bg-white dark:bg-slate-800 
      border border-slate-300 dark:border-slate-600 
      rounded-lg 
      text-slate-900 dark:text-slate-100 
      focus:border-primary-500 dark:focus:border-primary-400 
      focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30
      transition-all duration-150
      ${props.className ?? ''}
    `}
  >
    {children}
  </select>
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { rows?: number }> = (props) => (
  <textarea
    {...props}
    rows={props.rows ?? 4}
    className={`
      w-full px-3 py-2.5 
      bg-white dark:bg-slate-800 
      border border-slate-300 dark:border-slate-600 
      rounded-lg 
      text-slate-900 dark:text-slate-100 
      placeholder-slate-400 dark:placeholder-slate-500
      focus:border-primary-500 dark:focus:border-primary-400 
      focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30
      transition-all duration-150 resize-y
      ${props.className ?? ''}
    `}
  />
);

const Button: React.FC<{
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ 
  onClick, 
  variant = 'secondary', 
  size = 'md', 
  icon, 
  children, 
  title, 
  disabled = false, 
  type = 'button' 
}) => {
  const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800';
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary-500 to-primary-600 
      hover:from-primary-600 hover:to-primary-700 
      text-white shadow-innova hover:shadow-innova-md 
      focus:ring-primary-500
      dark:shadow-innova-glow/20
    `,
    secondary: `
      bg-slate-100 hover:bg-slate-200 
      dark:bg-slate-700 dark:hover:bg-slate-600 
      text-slate-700 dark:text-slate-200 
      border border-slate-200 dark:border-slate-600
      focus:ring-slate-500
    `,
    danger: `
      bg-danger-500 hover:bg-danger-600 
      text-white shadow-sm 
      focus:ring-danger-500
    `
  };
  
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:-translate-y-0.5';
  
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${disabledClasses}`}
    >
      {icon && <span className="text-current">{icon}</span>}
      {children}
    </button>
  );
};

const Modal: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}> = ({ open, title, onClose, children, footer, size = 'md' }) => {
  if (!open) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      role="button"
      tabIndex={0} 
      aria-label="Fechar modal"
      onClick={onClose}
      onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onClose();
      }}
      />
      <div className={`relative z-10 w-full ${sizeClasses[size]}`}>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CopiedBadge: React.FC<{ show: boolean; label?: string }> = ({ show, label = 'Copiado!' }) => {
  if (!show) return null;
  return (
    <span className="animate-scale-in rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-200">
      {label}
    </span>
  );
};

const SectionNavigation: React.FC<{
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  className?: string;
}> = ({ currentSection, onSectionChange, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 ${className}`}>
    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">Navegação</h3>
    <nav className="space-y-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
            ${currentSection === section.id 
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
            }
          `}
        >
          <span className={currentSection === section.id ? 'text-primary-500 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}>
            {section.icon}
          </span>
          <span className="font-medium">{section.label}</span>
          {currentSection === section.id && (
            <FaChevronRight className="ml-auto text-primary-500 dark:text-primary-400" />
          )}
        </button>
      ))}
    </nav>
  </div>
);

// ================================
// Main Component
// ================================
const LOCAL_KEY_PRESETS_CUSTOM = 'rh_template_presets_custom';
const LOCAL_KEY_SAVED_TEMPLATES = 'rh_template_saved_models';

const toPreset = (d: PresetData, isCustom = false): Preset => ({
  ...d,
  id: makeId(),
  isCustom,
});

const TemplateVagas: React.FC = () => {
  const [form, setForm] = useState<VagaForm>(defaultForm);
  const [currentSection, setCurrentSection] = useState<Section>('presets');

  const location = useLocation();

  useEffect(() => {
    const st = location.state as { section?: string } | null;

    // abre a seção "salvos" se vier com #saved ou com navigate(..., { state: { section: 'saved' } })
    if (location.hash === '#saved' || st?.section === 'saved') {
      // troca a "aba"
      setCurrentSection('saved');

      // garante o scroll até a âncora depois do render
      requestAnimationFrame(() => {
        const el = document.getElementById('saved');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location]);

  // ===== PRESETS =====
  const [builtinPresets] = useState<Preset[]>(
    builtinPresetsData.map(d => toPreset(d, false))
  );
  const [customPresets, setCustomPresets] = useState<Preset[]>([]);

  // ===== MODELOS SALVOS =====
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveTemplateName, setSaveTemplateName] = useState('');

  // ===== REFS =====
  const saveInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (saveModalOpen) saveInputRef.current?.focus();
  }, [saveModalOpen]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY_PRESETS_CUSTOM);
      if (raw) {
        const parsed = JSON.parse(raw) as PresetData[];
        if (Array.isArray(parsed)) {
          const restored = parsed.map(d => ({ ...toPreset(d, true) }));
          setCustomPresets(restored);
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY_SAVED_TEMPLATES);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedTemplate[];
        if (Array.isArray(parsed)) {
          setSavedTemplates(parsed);
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      const minimal: PresetData[] = customPresets.map(({ label, hint, area, responsabilidades, requisitosMust, requisitosNice }) => ({
        label, hint, area, responsabilidades, requisitosMust, requisitosNice
      }));
      localStorage.setItem(LOCAL_KEY_PRESETS_CUSTOM, JSON.stringify(minimal));
    } catch { /* ignore */ }
  }, [customPresets]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY_SAVED_TEMPLATES, JSON.stringify(savedTemplates));
    } catch { /* ignore */ }
  }, [savedTemplates]);

  const allPresets = useMemo(() => [...customPresets, ...builtinPresets], [customPresets, builtinPresets]);

  // ===== MODAL =====
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyPresetData: PresetData = {
    label: '',
    hint: '',
    area: '' as VagaForm['area'],  // ✅ corrigido
    responsabilidades: '',
    requisitosMust: '',
    requisitosNice: '',
  };

  const [presetForm, setPresetForm] = useState<PresetData>({
  label: '',
  hint: '',
  area: '' as VagaForm['area'],  // ✅ corrigido
  responsabilidades: '',
  requisitosMust: '',
  requisitosNice: '',
  });

  const openAddPreset = () => {
    setModalMode('add');
    setEditingId(null);
    setPresetForm(emptyPresetData);
    setModalOpen(true);
  };

  const openEditPreset = (p: Preset) => {
    if (!p.isCustom) return;
    setModalMode('edit');
    setEditingId(p.id);
    setPresetForm({
      label: p.label,
      hint: p.hint,
      area: p.area,
      responsabilidades: p.responsabilidades,
      requisitosMust: p.requisitosMust,
      requisitosNice: p.requisitosNice,
    });
    setModalOpen(true);
  };

  const savePreset = () => {
    if (!presetForm.label.trim() || !presetForm.area) return;

    if (modalMode === 'add') {
      const created: Preset = { ...toPreset(presetForm, true) };
      setCustomPresets(prev => [created, ...prev].slice(0, 100));
    } else if (modalMode === 'edit' && editingId) {
      setCustomPresets(prev => prev.map(p => 
        p.id === editingId ? { ...p, ...presetForm } : p
      ));
    }
    setModalOpen(false);
  };

  const deletePreset = (p: Preset) => {
    if (!p.isCustom) return;
    if (window.confirm(`Tem certeza que deseja excluir o preset "${p.label}"?`)) {
      setCustomPresets(prev => prev.filter(x => x.id !== p.id));
    }
  };

  // ===== SALVAR TEMPLATE =====
  const openSaveModal = () => {
    const defaultName = form.cargo ? `${form.cargo}${form.senioridade ? ` (${form.senioridade})` : ''}` : 'Novo Template';
    setSaveTemplateName(defaultName);
    setSaveModalOpen(true);
  };

  const saveTemplate = () => {
    if (!saveTemplateName.trim() || !isFormValid) return;

    const newTemplate: SavedTemplate = {
      id: makeId(),
      nome: saveTemplateName.trim(),
      cargo: form.cargo,
      area: form.area,
      data: new Date().toISOString(),
      conteudoMarkdown: templateMD,
      conteudoLinkedIn: linkedinTxt,
      formulario: { ...form }
    };

    setSavedTemplates(prev => [newTemplate, ...prev].slice(0, 50)); // Limitar a 50 templates
    setSaveModalOpen(false);
    setSaveTemplateName('');
  };

  const loadTemplate = (template: SavedTemplate) => {
    setForm(template.formulario);
    setCurrentSection('preview');
  };

  const deleteTemplate = (template: SavedTemplate) => {
    if (window.confirm(`Tem certeza que deseja excluir o template "${template.nome}"?`)) {
      setSavedTemplates(prev => prev.filter(t => t.id !== template.id));
    }
  };

  // ===== FEEDBACK =====
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedLinkedin, setCopiedLinkedin] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const templateMD = useMemo(() => buildTemplate(form), [form]);
  const linkedinTxt = useMemo(() => buildLinkedIn(form), [form]);

  const applyPreset = (p: Preset) => setForm(f => ({
    ...f,
    area: p.area,
    responsabilidades: p.responsabilidades,
    requisitosMust: p.requisitosMust,
    requisitosNice: p.requisitosNice,
  }));

  const isFormValid = form.cargo && form.area && form.responsabilidades && form.requisitosMust;

  const handleCopyTemplate = async () => {
    await copyToClipboard(templateMD);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleCopyLinkedin = async () => {
    await copyToClipboard(linkedinTxt);
    setCopiedLinkedin(true);
    setTimeout(() => setCopiedLinkedin(false), 2000);
  };

  const handleSaveTemplate = () => {
    openSaveModal();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'presets':
        return (
          <Card
            title="Presets de Cargos"
            subtitle="Use um preset existente ou gerencie presets customizados"
            icon={<FaMagic />}
            actions={
              <Button
                onClick={openAddPreset}
                variant="primary"
                size="sm"
                icon={<FaPlus />}
                title="Adicionar novo preset de cargo"
              >
                Novo preset
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {allPresets.map(p => (
                  <div
                    key={p.id}
                    className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-white dark:hover:bg-slate-800 hover:shadow-innova dark:hover:shadow-innova-glow/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1 text-primary-500 dark:text-primary-400">{getIconForArea(p.area)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900 dark:text-slate-50 truncate">
                              {p.label}
                            </h4>
                            {!p.isCustom && (
                              <span className="rounded bg-slate-200 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300">
                                padrão
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {p.hint}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            Área: {p.area || '–'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {p.isCustom && (
                          <>
                            <Button
                              onClick={() => openEditPreset(p)}
                              size="sm"
                              title="Editar preset"
                              icon={<FaEdit />}
                            >
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              onClick={() => deletePreset(p)}
                              size="sm"
                              variant="danger"
                              title="Excluir preset"
                              icon={<FaTrash />}
                            >
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </>
                        )}
                        <Button
                          onClick={() => applyPreset(p)}
                          size="sm"
                          variant="primary"
                          title="Aplicar preset"
                        >
                          Usar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {allPresets.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
                  <FaMagic className="mx-auto mb-3 text-2xl text-slate-400 dark:text-slate-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Nenhum preset ainda. Clique em <strong>Novo preset</strong> para criar o primeiro.
                  </p>
                </div>
              )}
            </div>
          </Card>
        );

      case 'basicas':
        return (
          <Card
            title="Informações Básicas"
            subtitle="Defina o cargo, senioridade e modelo de trabalho"
            icon={<FaBuilding />}
          >
            <FormSection title="Cargo e Área">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Cargo" required>
                  <Input
                    placeholder="Ex.: Desenvolvedor(a) Backend"
                    value={form.cargo}
                    onChange={e => setForm({ ...form, cargo: e.target.value })}
                  />
                </Field>
                
                <Field label="Área" required>
                  <Select 
                    value={form.area}
                    onChange={e => setForm({ ...form, area: e.target.value as VagaForm['area'] })}
                  >
                    <option value="">Selecione...</option>
                    {['Tecnologia','Produto','Design','Marketing','Vendas','Operações','RH','Financeiro','Jurídico'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </FormSection>

            <FormSection title="Senioridade e Modalidade">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Senioridade">
                  <Select 
                    value={form.senioridade}
                    onChange={e => setForm({ ...form, senioridade: e.target.value as VagaForm['senioridade'] })}
                  >
                    <option value="">Selecione...</option>
                    {['Estágio','Júnior','Pleno','Sênior','Líder','Especialista'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Select>
                </Field>
                
                <Field label="Modelo de trabalho">
                  <Select 
                    value={form.modeloTrabalho}
                    onChange={e => setForm({ ...form, modeloTrabalho: e.target.value as VagaForm['modeloTrabalho'] })}
                  >
                    <option value="">Selecione...</option>
                    {['Presencial','Remoto','Híbrido'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </FormSection>
          </Card>
        );

      case 'localizacao':
        return (
          <Card
            title="Localização e Contrato"
            subtitle="Defina onde será a vaga e tipo de contratação"
            icon={<FaMapMarkerAlt />}
          >
            <FormSection title="Localização">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Cidade">
                  <Input 
                    placeholder="Ex.: Brasília" 
                    value={form.cidade}
                    onChange={e => setForm({ ...form, cidade: e.target.value })} 
                  />
                </Field>
                
                <Field label="Estado/País">
                  <Input 
                    placeholder="Ex.: DF, Brasil" 
                    value={form.estadoPais}
                    onChange={e => setForm({ ...form, estadoPais: e.target.value })} 
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Contrato e Remuneração">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Tipo de contrato">
                  <Select 
                    value={form.tipoContrato}
                    onChange={e => setForm({ ...form, tipoContrato: e.target.value as VagaForm['tipoContrato'] })}
                  >
                    <option value="">Selecione...</option>
                    {['CLT','PJ','Temporário','Freelancer','Estágio'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Select>
                </Field>
                
                <Field label="Faixa salarial" hint="Opcional, mas recomendado">
                  <Input 
                    placeholder="Ex.: R$ 8k–12k + bônus"
                    value={form.faixaSalarial}
                    onChange={e => setForm({ ...form, faixaSalarial: e.target.value })} 
                  />
                </Field>
              </div>
            </FormSection>
          </Card>
        );

      case 'conteudo':
        return (
          <Card
            title="Conteúdo da Vaga"
            subtitle="Descreva responsabilidades, requisitos e benefícios"
            icon={<FaClipboardList />}
          >
            <FormSection title="Responsabilidades" subtitle="Liste as principais atividades, uma por linha">
              <Field label="Responsabilidades" required hint="Uma responsabilidade por linha">
                <TextArea 
                  rows={6}
                  placeholder="Ex.:&#10;• Desenvolver APIs REST robustas&#10;• Implementar testes automatizados&#10;• Colaborar com equipe de produto"
                  value={form.responsabilidades}
                  onChange={e => setForm({ ...form, responsabilidades: e.target.value })} 
                />
              </Field>
            </FormSection>
            
            <FormSection title="Requisitos e Qualificações">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Field label="Requisitos (Must-have)" required hint="Conhecimentos obrigatórios">
                  <TextArea 
                    rows={6}
                    placeholder="Ex.:&#10;• 3+ anos com Node.js&#10;• Experiência com PostgreSQL&#10;• Conhecimento de Git"
                    value={form.requisitosMust}
                    onChange={e => setForm({ ...form, requisitosMust: e.target.value })} 
                  />
                </Field>
                
                <Field label="Diferenciais (Nice-to-have)" hint="Conhecimentos desejáveis">
                  <TextArea 
                    rows={6}
                    placeholder="Ex.:&#10;• Docker/Kubernetes&#10;• AWS/GCP&#10;• Metodologias ágeis"
                    value={form.requisitosNice}
                    onChange={e => setForm({ ...form, requisitosNice: e.target.value })} 
                  />
                </Field>
              </div>
            </FormSection>
            
            <FormSection title="Benefícios e Empresa">
              <div className="space-y-6">
                <Field label="Benefícios" hint="Liste os benefícios oferecidos">
                  <TextArea 
                    rows={5}
                    placeholder="Ex.:&#10;Vale-refeição&#10;Plano de saúde&#10;Auxílio home office&#10;Horário flexível"
                    value={form.beneficios}
                    onChange={e => setForm({ ...form, beneficios: e.target.value })} 
                  />
                </Field>
                
                <Field label="Sobre a empresa" hint="Breve descrição da empresa e cultura">
                  <TextArea 
                    rows={5}
                    placeholder="Descreva brevemente a empresa, sua missão e cultura organizacional..."
                    value={form.sobreEmpresa}
                    onChange={e => setForm({ ...form, sobreEmpresa: e.target.value })} 
                  />
                </Field>
              </div>
            </FormSection>
          </Card>
        );

      case 'configuracoes':
        return (
          <Card
            title="Configurações Finais"
            subtitle="Defina como será a candidatura e personalize o tom"
            icon={<FaCog />}
          >
            <FormSection title="Candidatura e Prazo">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Link para candidatura" hint="URL do formulário ou email">
                  <Input 
                    type="url"
                    placeholder="https://forms.google.com/..." 
                    value={form.linkCandidatura}
                    onChange={e => setForm({ ...form, linkCandidatura: e.target.value })} 
                  />
                </Field>
                
                <Field label="Prazo (calendário)">
                  <Input
                    type="date"
                    value={form.prazoDate ?? ''}
                    onChange={(e) => setForm({ ...form, prazoDate: e.target.value || undefined })}
                  />
                </Field>
              </div>
            </FormSection>
            
            <FormSection title="Personalização">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Field label="Tom do texto">
                  <Select 
                    value={form.tom} 
                    onChange={e => setForm({ ...form, tom: e.target.value as VagaForm['tom'] })}
                  >
                    {['Direto','Empolgante','Formal','Amigável'].map(t => 
                      <option key={t} value={t}>{t}</option>
                    )}
                  </Select>
                </Field>
                
                <Field label="Idioma">
                  <Select 
                    value={form.idioma}
                    onChange={e => setForm({ ...form, idioma: e.target.value as VagaForm['idioma'] })}
                  >
                    <option value="pt">Português</option>
                    <option value="en">English</option>
                  </Select>
                </Field>
                
                <Field label="Inclusão & Diversidade">
                  <Select 
                    value={String(form.diversidade)}
                    onChange={e => setForm({ ...form, diversidade: e.target.value === 'true' })}
                  >
                    <option value="true">Incluir nota</option>
                    <option value="false">Não incluir</option>
                  </Select>
                </Field>
              </div>
            </FormSection>
          </Card>
        );

      case 'preview':
        return (
          <div className="space-y-8">
            {/* Template da vaga */}
            <Card
              title="Template da Vaga"
              subtitle="Descrição estruturada em markdown"
              icon={<FaFileAlt />}
              actions={
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopyTemplate}
                    icon={<FaCopy />}
                    size="sm"
                    title="Copiar template"
                    disabled={!isFormValid}
                  >
                    Copiar
                  </Button>
                  <CopiedBadge show={copiedTemplate} />
                </div>
              }
            >
              {!isFormValid ? (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-8 text-center">
                  <FaFileAlt className="mx-auto mb-3 text-3xl text-slate-400 dark:text-slate-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Preencha os campos obrigatórios para gerar o template
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                    Cargo, área, responsabilidades e requisitos são obrigatórios
                  </p>
                </div>
              ) : (
                <div className="max-h-96 overflow-auto rounded-lg bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700">
                  <pre className="whitespace-pre-wrap text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed">
                    {templateMD}
                  </pre>
                </div>
              )}
            </Card>

            {/* Post LinkedIn */}
            <Card
              title="Post para LinkedIn"
              subtitle="Texto otimizado para divulgação"
              icon={<FaLinkedin />}
              actions={
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSaveTemplate}
                    variant="primary"
                    icon={<FaSave />}
                    size="sm"
                    title="Salvar template"
                    disabled={!isFormValid}
                  >
                    Salvar
                  </Button>
                  <CopiedBadge show={savedSuccess} label="Salvo!" />
                  <Button
                    onClick={handleCopyLinkedin}
                    icon={<FaCopy />}
                    size="sm"
                    title="Copiar post"
                    disabled={!isFormValid}
                  >
                    Copiar
                  </Button>
                  <CopiedBadge show={copiedLinkedin} />
                  <Button
                    onClick={() => downloadTxt(linkedinTxt, 'post-linkedin.txt')}
                    variant="secondary"
                    icon={<FaDownload />}
                    size="sm"
                    title="Baixar como .txt"
                    disabled={!isFormValid}
                  >
                    Baixar
                  </Button>
                </div>
              }
            >
              {!isFormValid ? (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-8 text-center">
                  <FaLinkedin className="mx-auto mb-3 text-3xl text-slate-400 dark:text-slate-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Preencha os campos obrigatórios para gerar o post
                  </p>
                </div>
              ) : (
                <div className="max-h-64 overflow-auto rounded-lg bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700">
                  <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {linkedinTxt}
                  </pre>
                </div>
              )}
            </Card>

            {/* Dicas */}
            <Card
              title="Dicas de Divulgação"
              subtitle="Maximize o alcance da sua vaga"
              icon={<FaHashtag />}
            >
              <div className="space-y-4">
                <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 p-4 border border-primary-100 dark:border-primary-800">
                  <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-2">
                    LinkedIn
                  </h4>
                  <ul className="space-y-1 text-sm text-primary-800 dark:text-primary-200">
                    <li>• Publique em horários de maior engajamento (9h-11h, 14h-16h)</li>
                    <li>• Adicione uma imagem ou banner atrativo</li>
                    <li>• Responda comentários nas primeiras horas</li>
                  </ul>
                </div>
                
                <div className="rounded-lg bg-success-50 dark:bg-success-900/20 p-4 border border-success-100 dark:border-success-800">
                  <h4 className="font-medium text-success-900 dark:text-success-100 mb-2">
                    Outras estratégias
                  </h4>
                  <ul className="space-y-1 text-sm text-success-800 dark:text-success-200">
                    <li>• Compartilhe em grupos específicos da área</li>
                    <li>• Peça para a equipe amplificar o post</li>
                    <li>• Use Instagram Stories para alcance local</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'saved':
        return (
          <Card
            title="Modelos Salvos"
            subtitle="Acesse e gerencie seus templates salvos anteriormente"
            icon={<FaArchive />}
            actions={savedTemplates.length > 0 && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {savedTemplates.length} {savedTemplates.length === 1 ? 'modelo' : 'modelos'}
              </span>
            )}
          >
            <div id="saved" className="space-y-4">
              {savedTemplates.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
                  <FaArchive className="mx-auto mb-4 text-3xl text-slate-400 dark:text-slate-500" />
                  <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Nenhum modelo salvo ainda
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Crie um template na seção Preview e clique em &quot;Salvar&quot; para armazená-lo aqui.
                  </p>
                  <Button
                    onClick={() => setCurrentSection('preview')}
                    variant="primary"
                    icon={<FaEye />}
                  >
                    Ir para Preview
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {savedTemplates.map(template => (
                    <div
                      key={template.id}
                      className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-innova dark:hover:shadow-innova-glow/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="mt-1 text-primary-500 dark:text-primary-400">
                            {getIconForArea(template.area)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-900 dark:text-slate-50 truncate">
                              {template.nome}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {template.cargo}
                              </p>
                              <span className="text-slate-400 dark:text-slate-500">•</span>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {template.area}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                              <FaClock />
                              <span>{formatDateTimeBR(template.data)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={() => loadTemplate(template)}
                            size="sm"
                            variant="primary"
                            title="Carregar template"
                            icon={<FaEye />}
                          >
                            Carregar
                          </Button>
                          <Button
                            onClick={() => copyToClipboard(template.conteudoMarkdown)}
                            size="sm"
                            title="Copiar markdown"
                            icon={<FaCopy />}
                          >
                            MD
                          </Button>
                          <Button
                            onClick={() => copyToClipboard(template.conteudoLinkedIn)}
                            size="sm"
                            title="Copiar LinkedIn"
                            icon={<FaLinkedin />}
                          >
                            LI
                          </Button>
                          <Button
                            onClick={() => deleteTemplate(template)}
                            size="sm"
                            variant="danger"
                            title="Excluir template"
                            icon={<FaTrash />}
                          >
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <PageHeader
          title="Templates de Vagas"
          subtitle="Crie descrições estruturadas de vagas e posts otimizados para LinkedIn de forma automatizada"
          actions={
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setForm(defaultForm)}
                icon={<FaFileAlt />}
                title="Limpar formulário"
              >
                Limpar
              </Button>
            </div>
          }
        />

        {/* Layout principal */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Navegação lateral - 3 colunas */}
          <div className="lg:col-span-3">
            <SectionNavigation 
              currentSection={currentSection}
              onSectionChange={setCurrentSection}
              className="sticky top-6"
            />
          </div>

          {/* Conteúdo principal - 9 colunas */}
          <div className="lg:col-span-9">
            {renderSectionContent()}
          </div>
        </div>

        {/* MODAL: ADD/EDIT PRESET */}
        <Modal
          open={modalOpen}
          title={modalMode === 'add' ? 'Adicionar novo preset de cargo' : 'Editar preset de cargo'}
          size="lg"
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button 
                onClick={savePreset} 
                variant="primary"
                icon={<FaSave />}
                disabled={!presetForm.label.trim() || !presetForm.area}
              >
                {modalMode === 'add' ? 'Salvar preset' : 'Salvar alterações'}
              </Button>
            </>
          }
        >
          <div className="space-y-6">
            <FormSection title="Informações Básicas do Preset">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Nome do preset (cargo)" required>
                  <Input
                    placeholder="Ex.: Analista de Dados"
                    value={presetForm.label}
                    onChange={e => setPresetForm({ ...presetForm, label: e.target.value })}
                  />
                </Field>
                <Field label="Hint (breve descrição)">
                  <Input
                    placeholder="Ex.: dados, métricas, relatórios"
                    value={presetForm.hint}
                    onChange={e => setPresetForm({ ...presetForm, hint: e.target.value })}
                  />
                </Field>
                <Field label="Área" required>
                  <Select
                    value={presetForm.area}
                    onChange={e => setPresetForm({ ...presetForm, area: e.target.value as VagaForm['area'] })}
                  >
                    <option value="">Selecione...</option>
                    {['Tecnologia','Produto','Design','Marketing','Vendas','Operações','RH','Financeiro','Jurídico'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </FormSection>

            <FormSection title="Conteúdo do Preset">
              <div className="space-y-6">
                <Field label="Responsabilidades" required hint="Um item por linha">
                  <TextArea
                    rows={6}
                    placeholder="Ex.:&#10;• Levantar requisitos com stakeholders&#10;• Criar dashboards e relatórios&#10;• Garantir qualidade dos dados"
                    value={presetForm.responsabilidades}
                    onChange={e => setPresetForm({ ...presetForm, responsabilidades: e.target.value })}
                  />
                </Field>
                
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Field label="Requisitos (Must-have)" required hint="Um item por linha">
                    <TextArea
                      rows={6}
                      placeholder="Ex.:&#10;• SQL avançado&#10;• Experiência com Power BI ou Looker&#10;• Estatística básica"
                      value={presetForm.requisitosMust}
                      onChange={e => setPresetForm({ ...presetForm, requisitosMust: e.target.value })}
                    />
                  </Field>
                  <Field label="Diferenciais (Nice-to-have)" hint="Um item por linha">
                    <TextArea
                      rows={6}
                      placeholder="Ex.:&#10;• Python para análise de dados&#10;• Experiência com dbt&#10;• Conhecimento de modelagem dimensional"
                      value={presetForm.requisitosNice}
                      onChange={e => setPresetForm({ ...presetForm, requisitosNice: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </FormSection>
          </div>
        </Modal>

        {/* MODAL: SALVAR TEMPLATE */}
        <Modal
          open={saveModalOpen}
          title="Salvar Template"
          size="md"
          onClose={() => setSaveModalOpen(false)}
          footer={
            <>
              <Button onClick={() => setSaveModalOpen(false)}>Cancelar</Button>
              <Button 
                onClick={saveTemplate} 
                variant="primary"
                icon={<FaSave />}
                disabled={!saveTemplateName.trim() || !isFormValid}
              >
                Salvar template
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Salve este template para reutilizá-lo posteriormente. Tanto o conteúdo markdown quanto o post do LinkedIn serão salvos.
            </p>
            <Field label="Nome do template" required>
              <Input
                ref={saveInputRef}
                placeholder="Ex.: Desenvolvedor Backend Sênior"
                value={saveTemplateName}
                onChange={e => setSaveTemplateName(e.target.value)}
              />
            </Field>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p><strong>Cargo:</strong> {form.cargo || 'Não definido'}</p>
                <p><strong>Área:</strong> {form.area || 'Não definida'}</p>
                <p><strong>Senioridade:</strong> {form.senioridade || 'Não definida'}</p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TemplateVagas;