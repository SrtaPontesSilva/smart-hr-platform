// src/features/candidate/contract-form/FormContrato.tsx
import React, { useState, useRef } from 'react';
import { useForm, useFieldArray, FieldErrors, UseFormRegister } from 'react-hook-form';

import { useRegistrationStorage, Dependente, ContatoEmergencia } from '../../../shared/hooks/useRegistrationStorage';

interface FormData {
  nome: string;
  cpf: string;
  sexo: 'masculino' | 'feminino' | '';
  pis: string;
  certReservista?: string;

  enderecoRua: string;
  enderecoNumero: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoEstado: string;
  cep: string;

  menorIdade: 'sim' | 'nao';
  responsavelNome?: string;
  responsavelCpf?: string;
  responsavelRg?: string;
  responsavelEndereco?: string;
  responsavelTelefone?: string;
  responsavelEmail?: string;

  banco: string;
  agencia: string;
  conta: string;

  dependentes: Dependente[];
  contatosEmergencia: ContatoEmergencia[];
  documentos: { [key: string]: File | null };
}

interface InputFieldProps {
  label: string;
  name: keyof FormData;
  required?: boolean;
  type?: 'text' | 'email' | 'date' | 'tel';
  placeholder?: string;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

interface SelectFieldProps {
  label: string;
  name: keyof FormData;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  required = false,
  type = 'text',
  placeholder = '',
  register,
  errors,
}) => {
  const error = errors[name];
  const id = String(name);
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`input-innova w-full ${error ? 'border-danger-400 focus:border-danger-500' : ''}`}
        {...register(name, { required })}
      />
      {error && <p className="mt-1 text-sm text-danger-500">Este campo é obrigatório</p>}
    </div>
  );
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  required = false,
  options = [],
  placeholder = 'Selecione...',
  register,
  errors,
}) => {
  const error = errors[name];
  const id = String(name);
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select
        id={id}
        className={`input-innova w-full ${error ? 'border-danger-400 focus:border-danger-500' : ''}`}
        {...register(name, { required })}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-danger-500">Este campo é obrigatório</p>}
    </div>
  );
};

const ProgressIndicator: React.FC<{ step: number; totalSteps: number }> = ({ step, totalSteps }) => (
  <div className="mb-8">
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 inline-flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl innova-gradient">
          <span className="text-xl font-bold text-white">N</span>
        </div>
        <h1 className="text-4xl font-bold text-innova-gradient">Nome da Empresa</h1>
      </div>
      <p className="text-xl font-semibold text-primary-700">Cadastro de Contrato</p>
      <p className="mt-2 text-[var(--text-secondary)]">Complete suas informações para finalizar o processo</p>
    </div>

    <div className="mb-6 flex items-center justify-center">
      <div className="rounded-full px-6 py-2 text-sm font-medium text-white shadow-innova innova-gradient">
        Etapa {step} de {totalSteps}
      </div>
    </div>

    <div className="mb-4 flex items-center justify-center">
      {Array.from({ length: totalSteps }, (_, i) => (
        <React.Fragment key={i}>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 ${
              step > i
                ? 'border-primary-600 bg-primary-600 text-white shadow-innova'
                : step === i + 1
                ? 'border-primary-600 bg-primary-600 text-white shadow-innova'
                : 'border-[var(--card-border)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
            }`}
          >
            {step > i ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          {i < totalSteps - 1 && (
            <div className={`mx-4 h-2 w-16 rounded-full ${step > i ? 'innova-gradient' : 'bg-[var(--bg-tertiary)]'}`} />
          )}
        </React.Fragment>
      ))}
    </div>

    <div className="flex justify-center space-x-20 text-sm">
      <span className={`font-medium ${step === 1 ? 'text-primary-700' : 'text-[var(--text-secondary)]'}`}>Dados Pessoais</span>
      <span className={`font-medium ${step === 2 ? 'text-primary-700' : 'text-[var(--text-secondary)]'}`}>Informações Adicionais</span>
    </div>
  </div>
);

const documentosObrigatorios = [
  'Ficha preenchida',
  'Atestado médico admissional',
  'RG',
  'CPF',
  'CTPS',
  'Cartão do PIS',
  'Título de Eleitor',
  'Certidão de Nascimento dos filhos',
  'Certidão de Casamento',
  'CPF dos dependentes',
  'Certificado de Alistamento Militar',
  'Comprovante de Residência',
  'Informar Sindicato Representativo',
];

const FormContrato: React.FC = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nome: '',
      cpf: '',
      sexo: '',
      pis: '',
      certReservista: '',
      enderecoRua: '',
      enderecoNumero: '',
      enderecoBairro: '',
      enderecoCidade: '',
      enderecoEstado: '',
      cep: '',
      menorIdade: 'nao',
      responsavelNome: '',
      responsavelCpf: '',
      responsavelRg: '',
      responsavelEndereco: '',
      responsavelTelefone: '',
      responsavelEmail: '',
      banco: '',
      agencia: '',
      conta: '',
      dependentes: [{ nome: '', dataNascimento: '', cpf: '' }],
      contatosEmergencia: [
        { nome: '', telefone: '', email: '', parentesco: '' },
        { nome: '', telefone: '', email: '', parentesco: '' },
      ],
      documentos: {},
    },
  });

  const { fields: dependentes, append: addDependente, remove: removeDependente } = useFieldArray({
    control,
    name: 'dependentes',
  });

  // removidos append/remove não utilizados para evitar no-unused-vars
  const { fields: contatos } = useFieldArray({
    control,
    name: 'contatosEmergencia',
  });

  const { mergeRegistration } = useRegistrationStorage();

  const sexo = watch('sexo');
  const menorIdade = watch('menorIdade');

  const onSubmit = (data: FormData) => {
    mergeRegistration({
      nomeCompleto: data.nome,
      cpf: data.cpf,
      sexo: data.sexo,
      pis: data.pis,
      certReservista: data.certReservista,
      enderecoRua: data.enderecoRua,
      enderecoNumero: data.enderecoNumero,
      enderecoBairro: data.enderecoBairro,
      enderecoCidade: data.enderecoCidade,
      enderecoEstado: data.enderecoEstado,
      cep: data.cep,
      menorIdade: data.menorIdade,
      responsavelNome: data.responsavelNome,
      responsavelCpf: data.responsavelCpf,
      responsavelRg: data.responsavelRg,
      responsavelEndereco: data.responsavelEndereco,
      responsavelTelefone: data.responsavelTelefone,
      responsavelEmail: data.responsavelEmail,
      dependentes: data.dependentes,
      contatosEmergencia: data.contatosEmergencia,
    });

    if (step < totalSteps) setStep((s) => s + 1);
    else console.log('Formulário completo:', data);
  };

  const nextStep = () => step < totalSteps && setStep((s) => s + 1);
  const prevStep = () => step > 1 && setStep((s) => s - 1);

  // ---- Helpers da seção de documentos (UX melhorada) ----
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  const handlePickFile = (doc: string) => {
    const ref = fileInputsRef.current[doc];
    if (ref) ref.click();
  };

  const handleFileChange = (doc: string, file: File | null) => {
    setValue(`documentos.${doc}`, file);
  };

  const documentosMap = watch('documentos'); // tipo: { [key: string]: File | null }

  return (
    <div className="candidate-theme min-h-screen bg-[var(--bg-primary)] px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <ProgressIndicator step={step} totalSteps={totalSteps} />

        {/* Card principal com tokens/gradientes corretos */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-20 translate-x-1.5 translate-y-1.5 rounded-3xl bg-gradient-primary-subtle"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-[var(--bg-primary)]/90 shadow-innova ring-1 ring-[var(--card-border)]" />

          <div className="innova-card-bg rounded-3xl p-6 shadow-innova md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <>
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
                      <div className="md:col-span-2">
                        <InputField
                          label="Nome Completo"
                          name="nome"
                          required
                          placeholder="Digite seu nome completo"
                          register={register}
                          errors={errors}
                        />
                      </div>

                      <InputField label="CPF" name="cpf" required placeholder="000.000.000-00" register={register} errors={errors} />

                      <SelectField
                        label="Sexo"
                        name="sexo"
                        required
                        options={[
                          { value: 'feminino', label: 'Feminino' },
                          { value: 'masculino', label: 'Masculino' },
                        ]}
                        register={register}
                        errors={errors}
                      />

                      <InputField label="Nº PIS" name="pis" required placeholder="000.00000.00-0" register={register} errors={errors} />

                      {sexo === 'masculino' && (
                        <InputField
                          label="Certificado de Reservista"
                          name="certReservista"
                          placeholder="Número do certificado"
                          register={register}
                          errors={errors}
                        />
                      )}

                      <SelectField
                        label="Menor de Idade?"
                        name="menorIdade"
                        required
                        options={[
                          { value: 'sim', label: 'Sim' },
                          { value: 'nao', label: 'Não' },
                        ]}
                        register={register}
                        errors={errors}
                      />
                    </div>
                  </section>

                  {/* Endereço */}
                  <section>
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                        <svg className="h-4 w-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Endereço</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <InputField label="CEP" name="cep" required placeholder="00000-000" register={register} errors={errors} />

                      <div className="md:col-span-2">
                        <InputField label="Rua" name="enderecoRua" required placeholder="Nome da rua" register={register} errors={errors} />
                      </div>

                      <InputField label="Número" name="enderecoNumero" required placeholder="123" register={register} errors={errors} />

                      <InputField label="Bairro" name="enderecoBairro" required placeholder="Nome do bairro" register={register} errors={errors} />

                      <InputField label="Cidade" name="enderecoCidade" required placeholder="Nome da cidade" register={register} errors={errors} />

                      <div className="md:col-span-2">
                        <InputField label="Estado" name="enderecoEstado" required placeholder="Nome do estado" register={register} errors={errors} />
                      </div>
                    </div>
                  </section>

                  <div className="flex justify-end pt-6">
                    <button type="button" onClick={nextStep} className="innova-button innova-button-primary px-8 py-3 font-semibold">
                      Próximo →
                    </button>
                  </div>

                  {/* Responsável (condicional) */}
                  {menorIdade === 'sim' && (
                    <section className="rounded-lg border-2 border-warning-200 bg-warning-50 p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-100">
                          <svg className="h-4 w-4 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-warning-700">Dados do Responsável</h2>
                      </div>
                      <p className="mb-6 font-medium text-warning-600">Obrigatório para menores de idade</p>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <InputField label="Nome do Responsável" name="responsavelNome" placeholder="Nome completo" register={register} errors={errors} />
                        <InputField label="CPF do Responsável" name="responsavelCpf" placeholder="000.000.000-00" register={register} errors={errors} />
                        <InputField label="RG do Responsável" name="responsavelRg" placeholder="00.000.000-0" register={register} errors={errors} />
                        <InputField
                          label="Telefone do Responsável"
                          name="responsavelTelefone"
                          placeholder="(00) 00000-0000"
                          type="tel"
                          register={register}
                          errors={errors}
                        />
                        <InputField
                          label="Email do Responsável"
                          name="responsavelEmail"
                          type="email"
                          placeholder="email@exemplo.com"
                          register={register}
                          errors={errors}
                        />
                        <InputField label="Endereço do Responsável" name="responsavelEndereco" placeholder="Endereço completo" register={register} errors={errors} />
                      </div>
                    </section>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  {/* Dados Bancários */}
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
                      {/* Banco */}
                      <div>
                        <label htmlFor="banco" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                          Banco <span className="text-danger">*</span>
                        </label>
                        <input
                          id="banco"
                          type="text"
                          placeholder="Nome do banco"
                          className={`input-innova w-full ${errors.banco ? 'border-danger-400 focus:border-danger-500' : ''}`}
                          aria-invalid={!!errors.banco || undefined}
                          aria-describedby={errors.banco ? 'banco-err' : undefined}
                          {...register('banco', { required: 'Campo obrigatório' })}
                        />
                        {errors.banco && (
                          <p id="banco-err" className="mt-1 text-sm text-danger-500">{String(errors.banco.message)}</p>
                        )}
                      </div>

                      {/* Agência */}
                      <div>
                        <label htmlFor="agencia" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                          Agência <span className="text-danger">*</span>
                        </label>
                        <input
                          id="agencia"
                          type="text"
                          placeholder="0000"
                          className={`input-innova w-full ${errors.agencia ? 'border-danger-400 focus:border-danger-500' : ''}`}
                          aria-invalid={!!errors.agencia || undefined}
                          aria-describedby={errors.agencia ? 'agencia-err' : undefined}
                          {...register('agencia', { required: 'Campo obrigatório' })}
                        />
                        {errors.agencia && (
                          <p id="agencia-err" className="mt-1 text-sm text-danger-500">{String(errors.agencia.message)}</p>
                        )}
                      </div>

                      {/* Conta */}
                      <div>
                        <label htmlFor="conta" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                          Conta <span className="text-danger">*</span>
                        </label>
                        <input
                          id="conta"
                          type="text"
                          placeholder="00000-0"
                          className={`input-innova w-full ${errors.conta ? 'border-danger-400 focus:border-danger-500' : ''}`}
                          aria-invalid={!!errors.conta || undefined}
                          aria-describedby={errors.conta ? 'conta-err' : undefined}
                          {...register('conta', { required: 'Campo obrigatório' })}
                        />
                        {errors.conta && (
                          <p id="conta-err" className="mt-1 text-sm text-danger-500">{String(errors.conta.message)}</p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Dependentes */}
                  <section>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                          <svg className="h-4 w-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Dependentes (IRRF)</h2>
                          <p className="text-sm text-[var(--text-secondary)]">Adicione seus dependentes para fins de imposto de renda</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => addDependente({ nome: '', dataNascimento: '', cpf: '' })}
                        className="innova-button innova-button-secondary px-4 py-2 text-sm font-medium"
                      >
                        + Adicionar
                      </button>
                    </div>

                    <div className="space-y-4">
                      {dependentes.map((_, i) => {
                        const nomeId = `dependente-nome-${i}`;
                        const nascId = `dependente-nasc-${i}`;
                        const cpfId = `dependente-cpf-${i}`;
                        return (
                          <div key={i} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                            <div className="mb-4 flex items-center justify-between">
                              <span className="font-medium text-[var(--text-primary)]">Dependente {i + 1}</span>
                              {dependentes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeDependente(i)}
                                  className="text-danger-600 transition-colors hover:text-danger-700"
                                >
                                  Remover
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <div>
                                <label htmlFor={nomeId} className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                                  Nome
                                </label>
                                <input
                                  id={nomeId}
                                  placeholder="Nome do dependente"
                                  className="input-innova w-full"
                                  {...register(`dependentes.${i}.nome` as const)}
                                />
                              </div>

                              <div>
                                <label htmlFor={nascId} className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                                  Data de Nascimento
                                </label>
                                <input
                                  id={nascId}
                                  type="date"
                                  className="input-innova w-full"
                                  {...register(`dependentes.${i}.dataNascimento` as const)}
                                />
                              </div>

                              <div>
                                <label htmlFor={cpfId} className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                                  CPF
                                </label>
                                <input
                                  id={cpfId}
                                  placeholder="000.000.000-00"
                                  className="input-innova w-full"
                                  {...register(`dependentes.${i}.cpf` as const)}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Contatos de Emergência */}
                  <section>
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-100">
                        <svg className="h-4 w-4 text-danger-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-danger-700">
                          Contatos de Emergência <span className="text-danger">*</span>
                        </h2>
                        <p className="text-danger-600/90">Pessoas para contatarmos em caso de emergência</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {contatos.map((_, i) => {
                        const nomeId = `contato-nome-${i}`;
                        const telId = `contato-telefone-${i}`;
                        const emailId = `contato-email-${i}`;
                        const parentId = `contato-parentesco-${i}`;

                        return (
                          <div key={i} className="rounded-lg border border-danger-200 bg-danger-50 p-4">
                            <h4 className="mb-4 font-medium text-danger-700">Contato {i + 1}</h4>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <label htmlFor={nomeId} className="mb-2 block text-sm font-medium text-danger-700">
                                  Nome <span className="text-danger">*</span>
                                </label>
                                <input
                                  id={nomeId}
                                  placeholder="Nome completo"
                                  className="input-innova w-full"
                                  {...register(`contatosEmergencia.${i}.nome` as const, { required: true })}
                                />
                              </div>

                              <div>
                                <label htmlFor={telId} className="mb-2 block text-sm font-medium text-danger-700">
                                  Telefone <span className="text-danger">*</span>
                                </label>
                                <input
                                  id={telId}
                                  placeholder="(00) 00000-0000"
                                  type="tel"
                                  className="input-innova w-full"
                                  {...register(`contatosEmergencia.${i}.telefone` as const, { required: true })}
                                />
                              </div>

                              <div>
                                <label htmlFor={emailId} className="mb-2 block text-sm font-medium text-danger-700">
                                  E-mail <span className="text-danger">*</span>
                                </label>
                                <input
                                  id={emailId}
                                  placeholder="email@exemplo.com"
                                  type="email"
                                  className="input-innova w-full"
                                  {...register(`contatosEmergencia.${i}.email` as const, { required: true })}
                                />
                              </div>

                              <div>
                                <label htmlFor={parentId} className="mb-2 block text-sm font-medium text-danger-700">
                                  Parentesco <span className="text-danger">*</span>
                                </label>
                                <input
                                  id={parentId}
                                  placeholder="Ex: Pai, Mãe, Irmão, etc."
                                  className="input-innova w-full"
                                  {...register(`contatosEmergencia.${i}.parentesco` as const, { required: true })}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Documentos Obrigatórios – UX melhorada */}
                  <section>
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
                        <svg className="h-4 w-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Documentos Obrigatórios</h2>
                        <p className="text-sm text-[var(--text-secondary)]">Anexe todos os documentos necessários</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {documentosObrigatorios.map((doc) => {
                        // id único para o input "real" (sr-only)
                        const inputId = `doc-input-${doc.replace(/\s+/g, '-').toLowerCase()}`;
                        return (
                          <div key={doc} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                            {/* Título informativo, não usar <label> para evitar a regra de a11y quando não há controle direto */}
                            <span className="mb-2 block font-medium text-[var(--text-primary)]">{doc}</span>

                            {/* Botão + nome do arquivo escolhido */}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                className="innova-button innova-button-secondary px-4 py-2 text-sm font-semibold"
                                onClick={() => handlePickFile(doc)}
                                aria-label={`Selecionar arquivo para ${doc}`}
                                aria-controls={inputId}
                              >
                                Selecionar arquivo
                              </button>

                              <span className="text-sm text-[var(--text-secondary)]">
                                {documentosMap?.[doc]?.name ?? 'Nenhum arquivo selecionado'}
                              </span>
                            </div>

                            {/* Input real (escondido) */}
                            <input
                              id={inputId}
                              type="file"
                              ref={(el) => {
                                fileInputsRef.current[doc] = el;
                              }}
                              className="sr-only"
                              onChange={(e) => handleFileChange(doc, e.target.files?.[0] || null)}
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />

                            <p className="mt-1 text-xs text-[var(--text-secondary)]">PDF, JPG, PNG, DOC, DOCX — Máx. 5MB</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Botões de navegação */}
                  <div className="flex justify-between pt-6">
                    <button type="button" onClick={prevStep} className="innova-button innova-button-secondary px-8 py-3 font-semibold">
                      ← Voltar
                    </button>

                    <button type="submit" className="innova-button innova-button-primary px-8 py-3 font-semibold">
                      Enviar Cadastro
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormContrato;
