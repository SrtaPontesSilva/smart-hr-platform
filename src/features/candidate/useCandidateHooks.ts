// frontend/src/features/candidate/useCandidateHooks.ts

import { useState, useEffect, useCallback, useMemo } from 'react';

import { 
  CandidateProfile, 
  ToastMessage, 
  RegistrationData, 
  AccordionSection,
  createBasicProfile 
} from './Candidate';

// ==================== CONSTANTES ====================

export const CANDIDATE_CONSTANTS = {
  STORAGE_KEYS: {
    PROFILE: 'candidateProfile',
    REGISTRATION: 'candidateRegistrationData',
    LEGACY_REGISTRATION: 'registration_data_v2'
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
  }
};

// ==================== HOOK: PROFILE DATA ====================

interface UseProfileDataReturn {
  profile: CandidateProfile | null;
  setProfile: (profile: CandidateProfile) => void;
  isLoading: boolean;
  updateProfile: (updates: Partial<CandidateProfile>) => Promise<void>;
  resetProfile: () => void;
  error: string | null;
}

export const useProfileData = (storageKey = CANDIDATE_CONSTANTS.STORAGE_KEYS.PROFILE): UseProfileDataReturn => {
  const [profile, setProfileState] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Perfil dummy para desenvolvimento
  const createDummyProfile = useCallback((): CandidateProfile => 
    createBasicProfile({
      id: '1',
      name: 'Ana Silva Santos',
      jobTitle: 'Desenvolvedora Frontend',
      email: 'ana.silva@email.com',
      phone: '61999887766',
      formation: [
        { 
          degree: 'Bacharel em Ciência da Computação', 
          institution: 'Universidade de Brasília', 
          graduationDate: '12/2023' 
        }
      ],
      experiences: [
        { 
          role: 'Desenvolvedora React', 
          company: 'Tech Solutions',
          startDate: 'Jan 2023', 
          endDate: 'Present', 
          description: 'Desenvolvimento de interfaces web modernas com React e TypeScript.'
        }
      ],
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Git'],
      resumeUrl: '/files/ana-curriculo.pdf',
      documents: ['/files/doc1.pdf', '/files/doc2.pdf'],
      jobSummary: 'Desenvolvedora apaixonada por tecnologia com foco em criar experiências de usuário excepcionais.',
      avatarUrl: '',
      coverColor: 'linear-gradient(135deg, #5E3BFF 0%, #22C1FF 100%)'
    }), []);

  // Carrega dados do localStorage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError(null);
        const storedData = localStorage.getItem(storageKey);
        
        if (storedData) {
          const parsedProfile = JSON.parse(storedData);
          setProfileState(parsedProfile);
        } else {
          // Usa perfil dummy se não houver dados
          const dummy = createDummyProfile();
          setProfileState(dummy);
          localStorage.setItem(storageKey, JSON.stringify(dummy));
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setError('Erro ao carregar dados do perfil');
        const dummy = createDummyProfile();
        setProfileState(dummy);
      } finally {
        // Simula loading para UX
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    loadProfile();
  }, [storageKey, createDummyProfile]);

  // Atualiza perfil e localStorage
  const setProfile = useCallback((newProfile: CandidateProfile) => {
    try {
      setProfileState(newProfile);
      localStorage.setItem(storageKey, JSON.stringify(newProfile));
      setError(null);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setError('Erro ao salvar dados do perfil');
    }
  }, [storageKey]);

  // Atualiza campos específicos do perfil
  const updateProfile = useCallback(async (updates: Partial<CandidateProfile>) => {
    if (!profile) return;
    
    try {
      setError(null);
      const updatedProfile = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil');
      throw error;
    }
  }, [profile, setProfile]);

  // Reset do perfil
  const resetProfile = useCallback(() => {
    const dummy = createDummyProfile();
    setProfile(dummy);
  }, [createDummyProfile, setProfile]);

  return {
    profile,
    setProfile,
    isLoading,
    updateProfile,
    resetProfile,
    error
  };
};

// ==================== HOOK: REGISTRATION STORAGE ====================

interface UseRegistrationStorageReturn {
  registration: RegistrationData;
  mergeRegistration: (partial: Partial<RegistrationData>) => void;
  clearRegistration: () => void;
  isLoading: boolean;
}

export const useRegistrationStorage = (): UseRegistrationStorageReturn => {
  const [registration, setRegistration] = useState<RegistrationData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados de registro com migração
  useEffect(() => {
    try {
      const newData = localStorage.getItem(CANDIDATE_CONSTANTS.STORAGE_KEYS.REGISTRATION);
      const legacyData = localStorage.getItem(CANDIDATE_CONSTANTS.STORAGE_KEYS.LEGACY_REGISTRATION);

      if (newData) {
        setRegistration(JSON.parse(newData));
      } else if (legacyData) {
        // Migra dados antigos
        const parsed = JSON.parse(legacyData);
        setRegistration(parsed);
        localStorage.setItem(CANDIDATE_CONSTANTS.STORAGE_KEYS.REGISTRATION, legacyData);
        localStorage.removeItem(CANDIDATE_CONSTANTS.STORAGE_KEYS.LEGACY_REGISTRATION);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de registro:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Merge parcial de dados
  const mergeRegistration = useCallback((partial: Partial<RegistrationData>) => {
    setRegistration(prev => {
      const updated = {
        ...prev,
        ...partial,
        dependentes: partial.dependentes ?? prev.dependentes,
        contatosEmergencia: partial.contatosEmergencia ?? prev.contatosEmergencia,
      };
      
      try {
        localStorage.setItem(CANDIDATE_CONSTANTS.STORAGE_KEYS.REGISTRATION, JSON.stringify(updated));
      } catch (error) {
        console.error('Erro ao salvar dados de registro:', error);
      }
      
      return updated;
    });
  }, []);

  // Limpa dados de registro
  const clearRegistration = useCallback(() => {
    setRegistration({});
    try {
      localStorage.removeItem(CANDIDATE_CONSTANTS.STORAGE_KEYS.REGISTRATION);
      localStorage.removeItem(CANDIDATE_CONSTANTS.STORAGE_KEYS.LEGACY_REGISTRATION);
    } catch (error) {
      console.error('Erro ao limpar dados de registro:', error);
    }
  }, []);

  return {
    registration,
    mergeRegistration,
    clearRegistration,
    isLoading
  };
};

// ==================== HOOK: TOASTS ====================

interface UseToastsReturn {
  toasts: ToastMessage[];
  showToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToasts = (): UseToastsReturn => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove após 4 segundos
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, CANDIDATE_CONSTANTS.ANIMATION_DURATIONS.TOAST);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts
  };
};

// ==================== HOOK: ACCORDION ====================

interface UseAccordionReturn {
  sections: AccordionSection[];
  toggleSection: (sectionId: string) => void;
  openSection: (sectionId: string) => void;
  closeSection: (sectionId: string) => void;
  openAll: () => void;
  closeAll: () => void;
}

export const useAccordion = (initialSections: AccordionSection[]): UseAccordionReturn => {
  const [sections, setSections] = useState(initialSections);

  const toggleSection = useCallback((sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId 
          ? { ...section, isOpen: !section.isOpen } 
          : section
      )
    );
  }, []);

  const openSection = useCallback((sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId 
          ? { ...section, isOpen: true } 
          : section
      )
    );
  }, []);

  const closeSection = useCallback((sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId 
          ? { ...section, isOpen: false } 
          : section
      )
    );
  }, []);

  const openAll = useCallback(() => {
    setSections(prev => prev.map(section => ({ ...section, isOpen: true })));
  }, []);

  const closeAll = useCallback(() => {
    setSections(prev => prev.map(section => ({ ...section, isOpen: false })));
  }, []);

  return {
    sections,
    toggleSection,
    openSection,
    closeSection,
    openAll,
    closeAll
  };
};

// ==================== HOOK: MODAL ====================

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModal = (): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  // Cleanup e escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeModal]);

  return {
    isOpen,
    openModal,
    closeModal
  };
};

// ==================== HOOK: PROFILE TRANSFORMS ====================

interface UseProfileTransformsReturn {
  processedSkills: string[];
  processedDocuments: string[];
  displayName: string;
  displayEmail: string;
  displayPhone: string;
  formation: any[];
  experiences: any[];
  jobSummary: string;
}

export const useProfileTransforms = (profile: CandidateProfile | null): UseProfileTransformsReturn => {
  const { registration } = useRegistrationStorage();

  const processedSkills = useMemo(() => {
    if (!profile?.skills) return [];
    return (profile.skills as any[]).map(item =>
      typeof item === 'string' ? item : (item as any).name || String(item)
    );
  }, [profile?.skills]);

  const processedDocuments = useMemo(() => {
    if (!profile?.documents) return [];
    return (profile.documents as any[]).map(item =>
      typeof item === 'string' ? item : (item as any).url || String(item)
    );
  }, [profile?.documents]);

  const displayName = useMemo(() => {
    return registration.nomeCompleto || profile?.name || '';
  }, [registration.nomeCompleto, profile?.name]);

  const displayEmail = useMemo(() => {
    return registration.email || profile?.email || '';
  }, [registration.email, profile?.email]);

  const displayPhone = useMemo(() => {
    return registration.telefone || profile?.phone || '';
  }, [registration.telefone, profile?.phone]);

  return {
    processedSkills,
    processedDocuments,
    displayName,
    displayEmail,
    displayPhone,
    formation: profile?.formation || [],
    experiences: profile?.experiences || [],
    jobSummary: profile?.jobSummary || ''
  };
};

// ==================== UTILS ====================

export const candidateUtils = {
  // Converte arquivo para Base64
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Erro ao converter arquivo em Base64.'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  },

  // Formata telefone brasileiro
  formatPhone: (phone: string): string => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  },

  // Formata CPF
  formatCPF: (cpf: string): string => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  },

  // Formata CEP
  formatCEP: (cep: string): string => {
    const numbers = cep.replace(/\D/g, '');
    if (numbers.length === 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cep;
  },

  // Valida email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Valida CPF
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
  },

  // Trunca texto
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  }
};