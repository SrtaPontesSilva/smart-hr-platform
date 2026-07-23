// frontend/src/features/candidate/strings.ts

// Sistema simples de internacionalização centralizado
export type Language = 'pt' | 'en';

interface StringResources {
  // Headers e títulos
  editProfile: string;
  candidateProfile: string;
  personalData: string;
  academicFormation: string;
  professionalExperience: string;
  skills: string;
  documents: string;
  completeRegistration: string;
  aboutMe: string;

  // Ações
  edit: string;
  save: string;
  cancel: string;
  download: string;
  view: string;
  close: string;
  saving: string;

  // Formulários
  fullName: string;
  email: string;
  phone: string;
  profilePhoto: string;
  coverStyle: string;
  solidColor: string;
  gradient: string;
  color: string;
  color1: string;
  color2: string;
  coverPreview: string;
  clickCameraToChange: string;

  // Informações pessoais
  motherName: string;
  fatherName: string;
  cpf: string;
  rg: string;
  address: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
  maritalStatus: string;
  race: string;
  hasDependents: string;
  dependents: string;

  // Formação e experiência
  degree: string;
  institution: string;
  graduation: string;
  role: string;
  company: string;
  period: string;
  description: string;
  present: string;

  // Documentos
  resume: string;
  otherDocuments: string;
  notInformed: string;
  documentsCount: string;
  noDocuments: string;

  // Mensagens
  profileUpdatedSuccess: string;
  profileUpdateError: string;
  loadingProfile: string;
  requiredField: string;
  invalidEmail: string;
  fileTooLarge: string;
  unsupportedFormat: string;

  // Acessibilidade
  editProfileButton: string;
  closeModalButton: string;
  downloadDocumentButton: string;
  viewDocumentButton: string;
  changePhotoButton: string;
  toggleSectionButton: string;

  // Estados
  loading: string;
  error: string;
  success: string;
  noData: string;
  empty: string;

  // Campos adicionais dos formulários
  pis: string;
  reservistCertificate: string;
  isMinor: string;
  responsiblePerson: string;
  emergencyContacts: string;
  bankData: string;
  bank: string;
  agency: string;
  account: string;
  addressComplete: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  relationship: string;
}

const strings: Record<Language, StringResources> = {
  pt: {
    // Headers e títulos
    editProfile: 'Editar Perfil',
    candidateProfile: 'Perfil do Candidato',
    personalData: 'Dados Pessoais',
    academicFormation: 'Formação Acadêmica',
    professionalExperience: 'Experiência Profissional',
    skills: 'Habilidades',
    documents: 'Documentos',
    completeRegistration: 'Cadastro Completo',
    aboutMe: 'Sobre Mim',

    // Ações
    edit: 'Editar',
    save: 'Salvar',
    cancel: 'Cancelar',
    download: 'Baixar',
    view: 'Visualizar',
    close: 'Fechar',
    saving: 'Salvando',

    // Formulários
    fullName: 'Nome Completo',
    email: 'E-mail',
    phone: 'Telefone',
    profilePhoto: 'Foto de Perfil',
    coverStyle: 'Estilo da Capa',
    solidColor: 'Cor Sólida',
    gradient: 'Gradiente',
    color: 'Cor',
    color1: 'Cor 1',
    color2: 'Cor 2',
    coverPreview: 'Prévia da Capa',
    clickCameraToChange: 'Clique na câmera para alterar',

    // Informações pessoais
    motherName: 'Nome da Mãe',
    fatherName: 'Nome do Pai',
    cpf: 'CPF',
    rg: 'RG',
    address: 'Endereço',
    birthDate: 'Data de Nascimento',
    birthPlace: 'Local de Nascimento',
    gender: 'Sexo',
    maritalStatus: 'Estado Civil',
    race: 'Raça/Cor',
    hasDependents: 'Possui Dependentes',
    dependents: 'Dependentes',

    // Formação e experiência
    degree: 'Curso',
    institution: 'Instituição',
    graduation: 'Conclusão',
    role: 'Cargo',
    company: 'Empresa',
    period: 'Período',
    description: 'Descrição',
    present: 'Atual',

    // Documentos
    resume: 'Currículo',
    otherDocuments: 'Outros Documentos',
    notInformed: 'Não informado',
    documentsCount: 'documentos',
    noDocuments: 'Nenhum documento encontrado',

    // Mensagens
    profileUpdatedSuccess: 'Perfil atualizado com sucesso!',
    profileUpdateError: 'Erro ao atualizar perfil. Tente novamente.',
    loadingProfile: 'Carregando perfil...',
    requiredField: 'Campo obrigatório',
    invalidEmail: 'E-mail inválido',
    fileTooLarge: 'Arquivo muito grande',
    unsupportedFormat: 'Formato não suportado',

    // Acessibilidade
    editProfileButton: 'Botão para editar perfil do candidato',
    closeModalButton: 'Fechar modal de edição',
    downloadDocumentButton: 'Baixar documento',
    viewDocumentButton: 'Visualizar documento',
    changePhotoButton: 'Alterar foto de perfil',
    toggleSectionButton: 'Expandir ou recolher seção',

    // Estados
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    noData: 'Nenhum dado encontrado',
    empty: 'Vazio',

    // Campos adicionais dos formulários
    pis: 'PIS',
    reservistCertificate: 'Certificado de Reservista',
    isMinor: 'Menor de Idade',
    responsiblePerson: 'Responsável',
    emergencyContacts: 'Contatos de Emergência',
    bankData: 'Dados Bancários',
    bank: 'Banco',
    agency: 'Agência',
    account: 'Conta',
    addressComplete: 'Endereço Completo',
    street: 'Rua',
    number: 'Número',
    neighborhood: 'Bairro',
    city: 'Cidade',
    state: 'Estado',
    zipCode: 'CEP',
    relationship: 'Parentesco'
  },

  en: {
    // Headers and titles
    editProfile: 'Edit Profile',
    candidateProfile: 'Candidate Profile',
    personalData: 'Personal Data',
    academicFormation: 'Academic Formation',
    professionalExperience: 'Professional Experience',
    skills: 'Skills',
    documents: 'Documents',
    completeRegistration: 'Complete Registration',
    aboutMe: 'About Me',

    // Actions
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    download: 'Download',
    view: 'View',
    close: 'Close',
    saving: 'Saving',

    // Forms
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    profilePhoto: 'Profile Photo',
    coverStyle: 'Cover Style',
    solidColor: 'Solid Color',
    gradient: 'Gradient',
    color: 'Color',
    color1: 'Color 1',
    color2: 'Color 2',
    coverPreview: 'Cover Preview',
    clickCameraToChange: 'Click camera to change',

    // Personal info
    motherName: "Mother's Name",
    fatherName: "Father's Name",
    cpf: 'CPF',
    rg: 'ID',
    address: 'Address',
    birthDate: 'Birth Date',
    birthPlace: 'Birth Place',
    gender: 'Gender',
    maritalStatus: 'Marital Status',
    race: 'Race/Color',
    hasDependents: 'Has Dependents',
    dependents: 'Dependents',

    // Education & experience
    degree: 'Degree',
    institution: 'Institution',
    graduation: 'Graduation',
    role: 'Role',
    company: 'Company',
    period: 'Period',
    description: 'Description',
    present: 'Present',

    // Documents
    resume: 'Resume',
    otherDocuments: 'Other Documents',
    notInformed: 'Not informed',
    documentsCount: 'documents',
    noDocuments: 'No documents found',

    // Messages
    profileUpdatedSuccess: 'Profile updated successfully!',
    profileUpdateError: 'Error updating profile. Please try again.',
    loadingProfile: 'Loading profile...',
    requiredField: 'Required field',
    invalidEmail: 'Invalid email',
    fileTooLarge: 'File too large',
    unsupportedFormat: 'Unsupported format',

    // Accessibility
    editProfileButton: 'Button to edit candidate profile',
    closeModalButton: 'Close edit modal',
    downloadDocumentButton: 'Download document',
    viewDocumentButton: 'View document',
    changePhotoButton: 'Change profile photo',
    toggleSectionButton: 'Expand or collapse section',

    // States
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noData: 'No data found',
    empty: 'Empty',

    // Additional form fields
    pis: 'PIS',
    reservistCertificate: 'Military Certificate',
    isMinor: 'Minor',
    responsiblePerson: 'Responsible Person',
    emergencyContacts: 'Emergency Contacts',
    bankData: 'Bank Data',
    bank: 'Bank',
    agency: 'Agency',
    account: 'Account',
    addressComplete: 'Complete Address',
    street: 'Street',
    number: 'Number',
    neighborhood: 'Neighborhood',
    city: 'City',
    state: 'State',
    zipCode: 'ZIP Code',
    relationship: 'Relationship'
  }
};

// Hook simples para usar strings
let currentLanguage: Language = 'pt';

export const useStrings = () => {
  return {
    t: strings[currentLanguage],
    setLanguage: (lang: Language) => {
      currentLanguage = lang;
    },
    currentLanguage
  };
};

export const getStrings = (lang: Language = currentLanguage): StringResources => {
  return strings[lang];
};

// Constantes específicas do módulo
export const CANDIDATE_CONSTANTS = {
  STORAGE_KEYS: {
    PROFILE: 'candidateProfile',
    REGISTRATION: 'candidateRegistrationData'
  },

  FILE_LIMITS: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  },

  ANIMATION_DURATIONS: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    TOAST: 4000
  },

  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE: 1280
  },

  SECTIONS: {
    PERSONAL: 'personal',
    FORMATION: 'formation',
    EXPERIENCE: 'experience',
    SKILLS: 'skills',
    DOCUMENTS: 'documents',
    REGISTRATION: 'registration'
  }
};

// Utilitários para candidatos
export const candidateUtils = {
  formatPhone: (phone: string) => {
    if (!phone) return '';
    // Remove tudo que não for número
    const cleaned = phone.replace(/\D/g, '');
    
    // Aplica máscara (XX) XXXXX-XXXX
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    // Aplica máscara (XX) XXXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  },
  
  formatCPF: (cpf: string) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }
    
    return cpf;
  },
  
  formatRG: (rg: string) => {
    if (!rg) return '';
    const cleaned = rg.replace(/\D/g, '');
    
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
    }
    
    return rg;
  },
  
  formatCEP: (cep: string) => {
    if (!cep) return '';
    const cleaned = cep.replace(/\D/g, '');
    
    if (cleaned.length === 8) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    
    return cep;
  },
  
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Erro ao converter arquivo'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  },
  
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  validateCPF: (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '');
    
    if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) {
      return false;
    }
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(10))) return false;
    
    return true;
  }
};

export default strings;