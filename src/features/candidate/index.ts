// frontend/src/features/candidate/index.ts
// Arquivo de entrada principal do módulo de candidato

// Páginas
export { default as CandidateProfilePage } from './CandidateProfilePage';
export { default as CandidateRegistrationPage } from './CandidateRegistrationPage';

// Componentes reutilizáveis
export {
  Card,
  DocumentCard,
  SkillsSection,
  FormationSection,
  ExperienceSection,
  // REMOVIDOS: PersonalDataSection, RegistrationDataSection (só existem no ProfileComponents)
  InfoItem,
  AccordionCard,
  ToastContainer,
  SkeletonLoader,
  FocusTrap
} from './CandidateComponents';

// Hooks customizados
export {
  useProfileData,
  useToasts,
  useAccordion,
  useModal,
  useProfileTransforms,
  candidateUtils
} from './useCandidateHooks';

// Tipos e interfaces
// Corrigir a origem dos tipos para './Candidate' (onde eles são definidos)
export type {
  CandidateProfile,
  Formation,
  Experience,
  // Se houver outros tipos úteis, reexporte-os aqui a partir de './Candidate'
} from './Candidate';

// Configurações de rotas para o módulo
export const CANDIDATE_ROUTES = {
  PROFILE: '/candidato/perfil',
  REGISTRATION: '/candidato/cadastro',
  EDIT: '/candidato/editar'
} as const;

// Configurações do módulo
export const CANDIDATE_CONFIG = {
  MODULE_NAME: 'candidate',
  VERSION: '1.0.0',
  FEATURES: {
    PROFILE_EDITING: true,
    DOCUMENT_UPLOAD: true,
    SKILLS_MANAGEMENT: true,
    REGISTRATION_FLOW: true,
    ACCESSIBILITY: true,
    DARK_MODE: true,
    INTERNATIONALIZATION: true
  },
  PERFORMANCE: {
    LAZY_LOADING: true,
    MEMOIZATION: true,
    VIRTUAL_SCROLLING: false, // Para listas grandes no futuro
    IMAGE_OPTIMIZATION: true
  }
} as const;
