// frontend/src/features/candidate/Candidate.ts

// ==================== INTERFACES PRINCIPAIS ====================

export interface Formation {
  degree: string;
  institution: string;
  graduationDate: string;
  description?: string;
  gpa?: string;
  honors?: string[];
}

export interface Experience {
  role: string;
  company?: string;
  startDate: string;
  endDate: string;
  description?: string;
  location?: string;
  technologies?: string[];
  achievements?: string[];
}

export interface Skill {
  name: string;
  level?: 'Básico' | 'Intermediário' | 'Avançado' | 'Especialista';
  category?: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Design' | 'Soft Skills' | 'Other';
  yearsOfExperience?: number;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'docx' | 'image' | 'other';
  size?: number;
  uploadDate?: string;
  description?: string;
}

export interface EmergencyContact {
  nome: string;
  telefone: string;
  email: string;
  parentesco: string;
}

export interface Dependent {
  nome: string;
  dataNascimento: string;
  cpf: string;
  relationship?: string;
}

export interface PersonalInfo {
  fullName?: string;
  dateOfBirth?: string;
  nationality?: string;
  maritalStatus?: string;
  gender?: 'masculino' | 'feminino' | '';
  rg?: string;
  pis?: string;
  certReservista?: string;
  isMinor?: boolean;
  motherName?: string;
  fatherName?: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface BankData {
  bank?: string;
  agency?: string;
  account?: string;
}

// ==================== DADOS DE REGISTRO ====================

export interface RegistrationData {
  nomeCompleto?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  sexo?: 'masculino' | 'feminino' | '';
  pis?: string;
  enderecoRua?: string;
  enderecoNumero?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoEstado?: string;
  cep?: string;
  certReservista?: string;
  menorIdade?: 'sim' | 'nao';
  responsavelNome?: string;
  responsavelCpf?: string;
  responsavelRg?: string;
  responsavelEndereco?: string;
  responsavelTelefone?: string;
  responsavelEmail?: string;
  dependentes?: Dependent[];
  contatosEmergencia?: EmergencyContact[];
  [key: string]: unknown;
}

// ==================== PERFIL PRINCIPAL ====================

export interface CandidateProfile {
  // Identificação
  id: string;
  
  // Informações Básicas (obrigatórias)
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  
  // Formação e Experiência
  formation: Formation[];
  experiences: Experience[];
  skills: string[] | Skill[];
  resumeUrl?: string;
  documents?: string[] | Document[];
  jobSummary?: string;
  
  // Mídia
  avatarUrl?: string;
  coverColor?: string;
  
  // Dados Expandidos
  personalInfo?: PersonalInfo;
  dependents?: Dependent[];
  bankData?: BankData;
  registrationData?: RegistrationData;
  
  // Metadados
  createdAt?: string;
  updatedAt?: string;
  version?: string;
  applicationStatus?: 'Draft' | 'Submitted' | 'Under Review' | 'Interview Scheduled' | 'Rejected' | 'Accepted';
  
  // Configurações
  isPublic?: boolean;
  showContactInfo?: boolean;
  
  // Estatísticas
  profileViews?: number;
  applicationCount?: number;
}

// ==================== INTERFACES DE UI ====================

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface AccordionSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
}

export interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number';
  multiline?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  rows?: number;
}

export interface EditableSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  isEditing: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

// ==================== TIPOS UTILITÁRIOS ====================

export type CandidateProfileUpdate = Partial<CandidateProfile>;
export type CandidateProfileCreate = Omit<CandidateProfile, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

export type StatusVariant = 'primary' | 'success' | 'warning' | 'danger';
export type MenorIdadeFlag = 'sim' | 'nao' | undefined;

// ==================== ENUMS ====================

export enum SkillLevel {
  BASIC = 'Básico',
  INTERMEDIATE = 'Intermediário',
  ADVANCED = 'Avançado',
  EXPERT = 'Especialista'
}

export enum ApplicationStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  INTERVIEW_SCHEDULED = 'Interview Scheduled',
  REJECTED = 'Rejected',
  ACCEPTED = 'Accepted'
}

// ==================== FUNÇÕES HELPER ====================

export function createBasicProfile(data: Partial<CandidateProfile>): CandidateProfile {
  return {
    id: data.id || '',
    name: data.name || '',
    jobTitle: data.jobTitle || '',
    email: data.email || '',
    phone: data.phone || '',
    formation: data.formation || [],
    experiences: data.experiences || [],
    skills: data.skills || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0',
    applicationStatus: 'Draft',
    isPublic: false,
    showContactInfo: true,
    profileViews: 0,
    applicationCount: 0,
    ...data
  };
}

export function mergeRegistrationData(
  profile: CandidateProfile,
  registrationData: RegistrationData
): CandidateProfile {
  return {
    ...profile,
    name: registrationData.nomeCompleto || profile.name,
    email: registrationData.email || profile.email,
    phone: registrationData.telefone || profile.phone,
    dependents: registrationData.dependentes || profile.dependents,
    bankData: {
      bank: registrationData.banco,
      agency: registrationData.agencia,
      account: registrationData.conta,
    },
    personalInfo: {
      ...profile.personalInfo,
      gender: registrationData.sexo,
      pis: registrationData.pis,
      certReservista: registrationData.certReservista,
      isMinor: registrationData.menorIdade === 'sim',
      address: registrationData.enderecoRua ? {
        street: registrationData.enderecoRua,
        number: registrationData.enderecoNumero || '',
        neighborhood: registrationData.enderecoBairro || '',
        city: registrationData.enderecoCidade || '',
        state: registrationData.enderecoEstado || '',
        zipCode: registrationData.cep || '',
        country: 'Brasil'
      } : profile.personalInfo?.address,
    },
    registrationData,
    updatedAt: new Date().toISOString()
  };
}