// useRegistrationStorage.ts
import { useCallback, useEffect, useState } from 'react';

export interface Dependente {
  nome?: string;
  dataNascimento?: string;
  cpf?: string;
}

export interface ContatoEmergencia {
  nome?: string;
  telefone?: string;
  email?: string;
  parentesco?: string;
}

export type MenorIdadeFlag = 'sim' | 'nao' | undefined;

export interface RegistrationData {
  // Dados básicos
  nomeCompleto?: string;
  cpf?: string;
  email?: string;
  telefone?: string;

  // Bancários / existentes
  banco?: string;
  agencia?: string;
  conta?: string;

  // Novos campos do contrato
  sexo?: 'masculino' | 'feminino' | '';
  pis?: string;
  certReservista?: string;

  enderecoRua?: string;
  enderecoNumero?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoEstado?: string;
  cep?: string;

  menorIdade?: MenorIdadeFlag;
  responsavelNome?: string;
  responsavelCpf?: string;
  responsavelRg?: string;
  responsavelEndereco?: string;
  responsavelTelefone?: string;
  responsavelEmail?: string;

  dependentes?: Dependente[];
  contatosEmergencia?: ContatoEmergencia[];
}

const STORAGE_KEY = 'registration_data_v2';

function loadFromStorage(): RegistrationData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as RegistrationData;
    }
  } catch {
    // erros de parse são silenciosos
  }
  return {};
}

function saveToStorage(data: RegistrationData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota excedida, etc. — silenciar
  }
}

export const useRegistrationStorage = () => {
  const [registration, setRegistration] = useState<RegistrationData>(loadFromStorage);

  // sempre que mudar, persiste
  useEffect(() => {
    saveToStorage(registration);
  }, [registration]);

  const mergeRegistration = useCallback((partial: Partial<RegistrationData>) => {
    setRegistration(prev => ({
      ...prev,
      ...partial,
      dependentes: partial.dependentes ?? prev.dependentes,
      contatosEmergencia: partial.contatosEmergencia ?? prev.contatosEmergencia,
    }));
  }, []);

  const clearRegistration = useCallback(() => {
    setRegistration({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) { console.error(e); }
  }, []);

  return {
    registration,
    mergeRegistration,
    clearRegistration,
  };
};
