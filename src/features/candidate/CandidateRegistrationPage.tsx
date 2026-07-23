// frontend/src/features/candidate/CandidateRegistrationPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRegistrationStorage } from '../../shared/hooks/useRegistrationStorage';

interface CandidateRegistrationData {
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  banco: string;
  agencia: string;
  conta: string;
}

const initialFormData: CandidateRegistrationData = {
  nomeCompleto: '',
  cpf: '',
  email: '',
  telefone: '',
  banco: '',
  agencia: '',
  conta: '',
};

const CandidateRegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<CandidateRegistrationData>(initialFormData);
  const [documentosObrigatorios, setDocumentosObrigatorios] = useState<File[]>([]);
  const [curriculoPadronizado, setCurriculoPadronizado] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Apenas escrevemos no submit; não lemos do storage para popular o form
  const { mergeRegistration } = useRegistrationStorage();

  const handleChange = (field: keyof CandidateRegistrationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentosChange = (files: FileList | null) => {
    if (files) setDocumentosObrigatorios(Array.from(files));
  };

  const handleCurriculoChange = (files: FileList | null) => {
    if (files && files[0]) setCurriculoPadronizado(files[0]);
  };

  const validateForm = () => {
    return !!(
      formData.nomeCompleto &&
      formData.cpf &&
      formData.email &&
      formData.telefone &&
      documentosObrigatorios.length > 0 &&
      curriculoPadronizado
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios e envie os documentos.');
      return;
    }

    // Escreve no storage para o CandidateProfilePage.tsx consumir
    mergeRegistration({
      nomeCompleto: formData.nomeCompleto,
      cpf: formData.cpf,
      email: formData.email,
      telefone: formData.telefone,
      banco: formData.banco,
      agencia: formData.agencia,
      conta: formData.conta,
    });

    setIsSubmitting(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate('/perfil');
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // IDs para inputs de upload (acessibilidade)
  const documentosInputId = 'documentos-obrigatorios';
  const curriculoInputId = 'curriculo-pdf';

  return (
    <div className="candidate-theme min-h-screen bg-[var(--bg-primary)] px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl innova-gradient">
              <span className="text-xl font-bold text-white">N</span>
            </div>
            <h1 className="text-4xl font-bold text-innova-gradient">Nome da Empresa</h1>
          </div>
          <p className="font-semibold text-primary-600">Cadastro de Candidatos</p>
          <p className="mt-2 text-[var(--text-secondary)]">Preencha seus dados para começar sua jornada conosco</p>
        </div>

        {/* Card empilhado (camadas sutis com paleta correta) */}
        <div className="relative">
          {/* sombra/offset sutil */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-20 translate-x-1.5 translate-y-1.5 rounded-3xl bg-gradient-primary-subtle"
          />
          {/* brilho suave */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-[var(--bg-primary)]/90 shadow-innova ring-1 ring-[var(--card-border)]"
          />

          <div className="innova-card-bg overflow-hidden rounded-3xl p-6 shadow-innova md:p-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Dados Pessoais */}
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                    <svg className="h-4 w-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Dados Pessoais</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="nomeCompleto" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      Nome Completo <span className="text-danger">*</span>
                    </label>
                    <input
                      id="nomeCompleto"
                      type="text"
                      value={formData.nomeCompleto}
                      onChange={(e) => handleChange('nomeCompleto', e.target.value)}
                      className="input-innova w-full"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cpf" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      CPF <span className="text-danger">*</span>
                    </label>
                    <input
                      id="cpf"
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => handleChange('cpf', e.target.value)}
                      className="input-innova w-full"
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      E-mail <span className="text-danger">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="input-innova w-full"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="telefone" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                      Telefone <span className="text-danger">*</span>
                    </label>
                    <input
                      id="telefone"
                      type="text"
                      value={formData.telefone}
                      onChange={(e) => handleChange('telefone', e.target.value)}
                      className="input-innova w-full"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Dados Bancários
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                    <svg className="h-4 w-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8zM6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Dados Bancários</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label htmlFor="banco" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Banco</label>
                    <input
                      id="banco"
                      type="text"
                      value={formData.banco}
                      onChange={(e) => handleChange('banco', e.target.value)}
                      className="input-innova w-full"
                      placeholder="Nome do banco"
                    />
                  </div>
                  <div>
                    <label htmlFor="agencia" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Agência</label>
                    <input
                      id="agencia"
                      type="text"
                      value={formData.agencia}
                      onChange={(e) => handleChange('agencia', e.target.value)}
                      className="input-innova w-full"
                      placeholder="0000"
                    />
                  </div>
                  <div>
                    <label htmlFor="conta" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Conta</label>
                    <input
                      id="conta"
                      type="text"
                      value={formData.conta}
                      onChange={(e) => handleChange('conta', e.target.value)}
                      className="input-innova w-full"
                      placeholder="00000-0"
                    />
                  </div>
                </div>
              </section> */}

              {/* Documentos Obrigatórios */}
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                    <svg className="h-4 w-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Documentos Obrigatórios</h2>
                </div>

                <div className="rounded-lg border-2 border-dashed border-primary-300 bg-primary-50/40 p-6">
                  <label htmlFor={documentosInputId} className="mb-3 block text-sm font-medium text-[var(--text-primary)]">
                    Selecione os documentos (RG, CPF, etc.) <span className="text-danger">*</span>
                  </label>
                  <input
                    id={documentosInputId}
                    type="file"
                    multiple
                    onChange={(e) => handleDocumentosChange(e.target.files)}
                    className="w-full rounded-md border-2 border-primary-300 bg-white p-3 text-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    required
                  />
                  <p className="mt-2 text-xs text-[var(--text-secondary)]">Formatos aceitos: PDF, JPG, PNG. Máximo 10MB por arquivo.</p>
                </div>
              </section>

              {/* Currículo Padronizado */}
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-100">
                    <svg className="h-4 w-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-success-700">Currículo Padronizado</h2>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border-2 border-dashed border-success-300 bg-success-50 p-6">
                    <label htmlFor={curriculoInputId} className="mb-3 block text-sm font-medium text-success-700">
                      Upload do Currículo (PDF) <span className="text-danger">*</span>
                    </label>
                    <input
                      id={curriculoInputId}
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleCurriculoChange(e.target.files)}
                      className="w-full rounded-md border-2 border-success-300 bg-white p-3 text-sm transition focus:border-success-500 focus:ring-2 focus:ring-success-200"
                      required
                    />
                    <p className="mt-2 text-xs text-success-700/80">Apenas arquivos PDF são aceitos. Máximo 5MB.</p>
                  </div>

                  <div className="flex items-center justify-center">
                    <a
                      href="/arquivos/CurriculoPadrao.pdf"
                      download
                      className="inline-flex items-center gap-2 font-medium text-primary-700 transition-colors hover:text-primary-600"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Baixar modelo de currículo padrão
                    </a>
                  </div>
                </div>
              </section>

              {/* Botão de Envio */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="innova-button innova-button-primary w-full py-4 text-lg font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar Cadastro'
                  )}
                </button>
              </div>
            </form>

            {/* Feedback Visual */}
            {isSubmitting && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--text-primary)]">Processando seu cadastro...</p>
                  <span className="text-sm font-bold text-primary-700">{uploadProgress}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                  <div
                    className="relative h-full innova-gradient transition-all duration-500 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    <div className="absolute inset-0 animate-pulse bg-white/30" />
                  </div>
                </div>
                <p className="mt-2 text-center text-xs text-[var(--text-secondary)]">
                  Seus dados estão sendo processados com segurança
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-lg border border-danger-200 bg-danger-50 p-4">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-danger-700">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Já tem uma conta?{' '}
            <a href="/login" className="font-medium text-primary-700 transition-colors hover:text-primary-600">
              Faça login aqui
            </a>
          </p>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            Seus dados estão protegidos e são tratados conforme nossa política de privacidade
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidateRegistrationPage;
