// ==========================================
/* DadosPessoaisSection.tsx - Versão Padronizada (corrigida) */
// ==========================================
import React, { useState } from 'react';
import {
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCar,
  FaVenusMars,
  FaHeart,
  FaCalendarAlt,
  FaFlag,
  FaHashtag,
} from 'react-icons/fa';

import {
  Card,
  SectionHeader,
  InputField,
  SelectField,
  Toggle,
  designTokens,
} from './DesignSystem';
import { EmployeeFull } from './EmployeeProfilePage';

interface DadosPessoaisSectionProps {
  employeeData: EmployeeFull;
  isEditing: boolean;
  updateField: (field: keyof EmployeeFull, value: any) => void;
}

/** Componente para exibição de dados (modo visualização) — movido para fora do render */
const DataDisplay: React.FC<{
  label: string;
  value: any;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {icon && <span className="text-sm text-gray-400">{icon}</span>}
      <span
        className={`${designTokens.typography.label} text-gray-600 dark:text-gray-400`}
      >
        {label}:
      </span>
    </div>
    <p className="pl-6 text-sm text-gray-900 dark:text-gray-100">
      {value || '-'}
    </p>
  </div>
);

/** Componente principal como Arrow Function (corrige react/function-component-definition) */
const DadosPessoaisSection: React.FC<DadosPessoaisSectionProps> = ({
  employeeData,
  isEditing,
  updateField,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    pessoais: true,
    endereco: true,
    documentos: true,
    cnh: false,
    eleitorais: false,
    adicionais: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Opções padronizadas para selects
  const sexoOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' },
    { value: 'Outro', label: 'Outro' },
    { value: 'Não informar', label: 'Não informar' },
  ];

  const estadoCivilOptions = [
    { value: 'Solteiro', label: 'Solteiro(a)' },
    { value: 'Casado', label: 'Casado(a)' },
    { value: 'Divorciado', label: 'Divorciado(a)' },
    { value: 'Viúvo', label: 'Viúvo(a)' },
    { value: 'União Estável', label: 'União Estável' },
    { value: 'Separado', label: 'Separado(a)' },
  ];

  const grauInstrucaoOptions = [
    { value: 'Fundamental Incompleto', label: 'Fundamental Incompleto' },
    { value: 'Fundamental Completo', label: 'Fundamental Completo' },
    { value: 'Médio Incompleto', label: 'Médio Incompleto' },
    { value: 'Médio Completo', label: 'Médio Completo' },
    { value: 'Superior Incompleto', label: 'Superior Incompleto' },
    { value: 'Superior Completo', label: 'Superior Completo' },
    { value: 'Pós-graduação', label: 'Pós-graduação' },
    { value: 'Mestrado', label: 'Mestrado' },
    { value: 'Doutorado', label: 'Doutorado' },
  ];

  const cnhCategoriaOptions = [
    { value: 'A', label: 'Categoria A' },
    { value: 'B', label: 'Categoria B' },
    { value: 'C', label: 'Categoria C' },
    { value: 'D', label: 'Categoria D' },
    { value: 'E', label: 'Categoria E' },
    { value: 'AB', label: 'Categoria AB' },
    { value: 'AC', label: 'Categoria AC' },
    { value: 'AD', label: 'Categoria AD' },
    { value: 'AE', label: 'Categoria AE' },
  ];

  const racaOptions = [
    { value: 'Branca', label: 'Branca' },
    { value: 'Preta', label: 'Preta' },
    { value: 'Parda', label: 'Parda' },
    { value: 'Amarela', label: 'Amarela' },
    { value: 'Indígena', label: 'Indígena' },
    { value: 'Não declarar', label: 'Não declarar' },
  ];

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Informações Pessoais Básicas */}
        <Card variant="elevated">
          <SectionHeader
            title="Informações Pessoais"
            subtitle="Dados básicos do colaborador"
            icon={<FaUser />}
            collapsible
            isExpanded={expandedSections.pessoais}
            onToggle={() => toggleSection('pessoais')}
          />

          {expandedSections.pessoais && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <DataDisplay
                label="Nome Completo"
                value={employeeData.nome}
                icon={<FaUser />}
              />
              <DataDisplay
                label="CPF"
                value={employeeData.cpf}
                icon={<FaIdCard />}
              />
              <DataDisplay
                label="RG"
                value={employeeData.rg}
                icon={<FaIdCard />}
              />
              <DataDisplay
                label="Data de Nascimento"
                value={employeeData.dataNascimento}
                icon={<FaCalendarAlt />}
              />
              <DataDisplay
                label="Local de Nascimento"
                value={employeeData.localNascimento}
                icon={<FaMapMarkerAlt />}
              />
              <DataDisplay
                label="Sexo"
                value={employeeData.sexo}
                icon={<FaVenusMars />}
              />
              <DataDisplay
                label="Estado Civil"
                value={employeeData.estadoCivil}
                icon={<FaHeart />}
              />
              <DataDisplay
                label="Nome da Mãe"
                value={employeeData.nomeMae}
                icon={<FaUser />}
              />
              <DataDisplay
                label="Nome do Pai"
                value={employeeData.nomePai}
                icon={<FaUser />}
              />
            </div>
          )}
        </Card>

        {/* Endereço */}
        <Card variant="elevated">
          <SectionHeader
            title="Endereço"
            subtitle="Informações de localização"
            icon={<FaMapMarkerAlt />}
            collapsible
            isExpanded={expandedSections.endereco}
            onToggle={() => toggleSection('endereco')}
          />

          {expandedSections.endereco && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <DataDisplay
                label="Endereço Completo"
                value={employeeData.endereco}
                icon={<FaMapMarkerAlt />}
              />
              <DataDisplay
                label="CEP"
                value={employeeData.cep}
                icon={<FaHashtag />}
              />
            </div>
          )}
        </Card>

        {/* Documentos Adicionais */}
        <Card variant="elevated">
          <SectionHeader
            title="Documentação Adicional"
            subtitle="Outros documentos importantes"
            icon={<FaIdCard />}
            collapsible
            isExpanded={expandedSections.documentos}
            onToggle={() => toggleSection('documentos')}
          />

          {expandedSections.documentos && (
            <div className="mt-6 space-y-6">
              {/* CNH */}
              {(employeeData.cnhNumero || isEditing) && (
                <div>
                  <h4
                    className={`${designTokens.typography.heading.h5} mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300`}
                  >
                    <FaCar className="text-indigo-500" />
                    Carteira Nacional de Habilitação
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DataDisplay
                      label="Número"
                      value={employeeData.cnhNumero}
                    />
                    <DataDisplay
                      label="Categoria"
                      value={employeeData.cnhCategoria}
                    />
                    <DataDisplay
                      label="Validade"
                      value={employeeData.cnhValidade}
                    />
                    <DataDisplay label="UF" value={employeeData.cnhUF} />
                    <DataDisplay
                      label="Data de Expedição"
                      value={employeeData.cnhDataExpedicao}
                    />
                    <DataDisplay
                      label="Primeira Habilitação"
                      value={employeeData.cnhPrimeiraHabilitacao}
                    />
                  </div>
                </div>
              )}

              {/* Documentos Eleitorais */}
              {(employeeData.tituloEleitor || isEditing) && (
                <div>
                  <h4
                    className={`${designTokens.typography.heading.h5} mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300`}
                  >
                    <FaFlag className="text-green-500" />
                    Documentos Eleitorais
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <DataDisplay
                      label="Título de Eleitor"
                      value={employeeData.tituloEleitor}
                    />
                    <DataDisplay
                      label="Zona Eleitoral"
                      value={employeeData.zonaEleitoral}
                    />
                    <DataDisplay
                      label="Seção Eleitoral"
                      value={employeeData.secaoEleitoral}
                    />
                  </div>
                </div>
              )}

              {/* Outros */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <DataDisplay
                  label="Grau de Instrução"
                  value={employeeData.grauInstrucao}
                  icon={<FaGraduationCap />}
                />
                <DataDisplay label="Raça/Cor" value={employeeData.raca} />
                <DataDisplay label="Número PIS" value={employeeData.numeroPis} />
                {employeeData.sexo === 'Masculino' && (
                  <DataDisplay
                    label="Certificado Reservista"
                    value={employeeData.certificadoReservista}
                  />
                )}
                <DataDisplay
                  label="Primeiro Emprego"
                  value={
                    employeeData.primeiroEmprego === undefined ||
                    employeeData.primeiroEmprego === null
                      ? '-'
                      : employeeData.primeiroEmprego
                      ? 'Sim'
                      : 'Não'
                  }
                />
              </div>
            </div>
          )}
        </Card>

        {/* Dependentes */}
        {employeeData.dependentes &&
          (Array.isArray(employeeData.dependentes)
            ? employeeData.dependentes.length > 0
            : false) && (
            <Card variant="elevated">
              <SectionHeader
                title="Dependentes"
                subtitle={`${employeeData.dependentes.length} dependente(s) cadastrado(s)`}
                icon={<FaUser />}
                badge={employeeData.dependentes.length}
              />

              <div className="mt-6 space-y-4">
                {(Array.isArray(employeeData.dependentes)
                  ? employeeData.dependentes
                  : []
                ).map((dep: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <DataDisplay label="Nome" value={dep.nome} />
                      <DataDisplay
                        label="Data de Nascimento"
                        value={dep.dataNascimento}
                      />
                      <DataDisplay label="CPF" value={dep.cpf} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
      </div>
    );
  }

  // Modo de edição
  return (
    <div className="space-y-6">
      {/* Informações Pessoais - Edição */}
      <Card variant="elevated">
        <SectionHeader
          title="Informações Pessoais"
          subtitle="Dados básicos do colaborador"
          icon={<FaUser />}
          collapsible
          isExpanded={expandedSections.pessoais}
          onToggle={() => toggleSection('pessoais')}
        />

        {expandedSections.pessoais && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InputField
              label="Nome Completo"
              value={employeeData.nome ?? ''}
              onChange={(v) => updateField('nome', v)}
              icon={<FaUser />}
              required
            />
            <InputField
              label="CPF"
              value={employeeData.cpf ?? ''}
              onChange={(v) => updateField('cpf', v)}
              placeholder="000.000.000-00"
              icon={<FaIdCard />}
              required
            />
            <InputField
              label="RG"
              value={employeeData.rg ?? ''}
              onChange={(v) => updateField('rg', v)}
              placeholder="00.000.000-0"
              icon={<FaIdCard />}
              required
            />
            <InputField
              label="Data de Nascimento"
              value={employeeData.dataNascimento ?? ''}
              onChange={(v) => updateField('dataNascimento', v)}
              type="date"
              icon={<FaCalendarAlt />}
              required
            />
            <InputField
              label="Local de Nascimento"
              value={employeeData.localNascimento ?? ''}
              onChange={(v) => updateField('localNascimento', v)}
              icon={<FaMapMarkerAlt />}
            />
            <SelectField
              label="Sexo"
              value={employeeData.sexo ?? ''}
              onChange={(v) => updateField('sexo', v)}
              options={sexoOptions}
              required
            />
            <SelectField
              label="Estado Civil"
              value={employeeData.estadoCivil ?? ''}
              onChange={(v) => updateField('estadoCivil', v)}
              options={estadoCivilOptions}
            />
            <InputField
              label="Nome da Mãe"
              value={employeeData.nomeMae ?? ''}
              onChange={(v) => updateField('nomeMae', v)}
              icon={<FaUser />}
            />
            <InputField
              label="Nome do Pai"
              value={employeeData.nomePai ?? ''}
              onChange={(v) => updateField('nomePai', v)}
              icon={<FaUser />}
            />
          </div>
        )}
      </Card>

      {/* Endereço - Edição */}
      <Card variant="elevated">
        <SectionHeader
          title="Endereço"
          subtitle="Informações de localização"
          icon={<FaMapMarkerAlt />}
          collapsible
          isExpanded={expandedSections.endereco}
          onToggle={() => toggleSection('endereco')}
        />

        {expandedSections.endereco && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <InputField
              label="Endereço Completo"
              value={employeeData.endereco ?? ''}
              onChange={(v) => updateField('endereco', v)}
              placeholder="Rua, número, bairro, cidade, estado"
              icon={<FaMapMarkerAlt />}
            />
            <InputField
              label="CEP"
              value={employeeData.cep ?? ''}
              onChange={(v) => updateField('cep', v)}
              placeholder="00000-000"
              icon={<FaHashtag />}
            />
          </div>
        )}
      </Card>

      {/* Informações Adicionais - Edição */}
      <Card variant="elevated">
        <SectionHeader
          title="Informações Adicionais"
          subtitle="Documentos e dados complementares"
          icon={<FaGraduationCap />}
          collapsible
          isExpanded={expandedSections.adicionais}
          onToggle={() => toggleSection('adicionais')}
        />

        {expandedSections.adicionais && (
          <div className="mt-6 space-y-8">
            {/* Dados Gerais */}
            <div>
              <h4
                className={`${designTokens.typography.heading.h5} mb-4 text-gray-700 dark:text-gray-300`}
              >
                Dados Gerais
              </h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  label="Grau de Instrução"
                  value={employeeData.grauInstrucao ?? ''}
                  onChange={(v) => updateField('grauInstrucao', v)}
                  options={grauInstrucaoOptions}
                />
                <SelectField
                  label="Raça/Cor"
                  value={employeeData.raca ?? ''}
                  onChange={(v) => updateField('raca', v)}
                  options={racaOptions}
                />
                <InputField
                  label="Número PIS"
                  value={employeeData.numeroPis ?? ''}
                  onChange={(v) => updateField('numeroPis', v)}
                  placeholder="000.00000.00-0"
                />

                {/* Primeiro Emprego Toggle — REMOVIDO <label> para corrigir jsx-a11y/label-has-associated-control */}
                <div className="space-y-2">
                  <div
                    className={`block ${designTokens.typography.label} text-gray-700 dark:text-gray-200`}
                  >
                    <div className="flex items-center gap-3">
                      <span>Primeiro Emprego:</span>
                      <Toggle
                        checked={employeeData.primeiroEmprego ?? false}
                        onChange={(checked) =>
                          updateField('primeiroEmprego', checked)
                        }
                        label={employeeData.primeiroEmprego ? 'Sim' : 'Não'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CNH */}
            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
              <SectionHeader
                title="Carteira Nacional de Habilitação (CNH)"
                icon={<FaCar />}
                collapsible
                isExpanded={expandedSections.cnh}
                onToggle={() => toggleSection('cnh')}
              />

              {expandedSections.cnh && (
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <InputField
                    label="Número da CNH"
                    value={employeeData.cnhNumero ?? ''}
                    onChange={(v) => updateField('cnhNumero', v)}
                  />
                  <InputField
                    label="Validade"
                    value={employeeData.cnhValidade ?? ''}
                    onChange={(v) => updateField('cnhValidade', v)}
                    type="date"
                  />
                  <InputField
                    label="UF"
                    value={employeeData.cnhUF ?? ''}
                    onChange={(v) => updateField('cnhUF', v)}
                    placeholder="SP"
                  />
                  <SelectField
                    label="Categoria"
                    value={employeeData.cnhCategoria ?? ''}
                    onChange={(v) => updateField('cnhCategoria', v)}
                    options={cnhCategoriaOptions}
                  />
                  <InputField
                    label="Data de Expedição"
                    value={employeeData.cnhDataExpedicao ?? ''}
                    onChange={(v) => updateField('cnhDataExpedicao', v)}
                    type="date"
                  />
                  <InputField
                    label="Primeira Habilitação"
                    value={employeeData.cnhPrimeiraHabilitacao ?? ''}
                    onChange={(v) => updateField('cnhPrimeiraHabilitacao', v)}
                    type="date"
                  />
                </div>
              )}
            </div>

            {/* Documentos Eleitorais */}
            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
              <SectionHeader
                title="Documentos Eleitorais"
                icon={<FaFlag />}
                collapsible
                isExpanded={expandedSections.eleitorais}
                onToggle={() => toggleSection('eleitorais')}
              />

              {expandedSections.eleitorais && (
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <InputField
                    label="Título de Eleitor"
                    value={employeeData.tituloEleitor ?? ''}
                    onChange={(v) => updateField('tituloEleitor', v)}
                  />
                  <InputField
                    label="Zona Eleitoral"
                    value={employeeData.zonaEleitoral ?? ''}
                    onChange={(v) => updateField('zonaEleitoral', v)}
                  />
                  <InputField
                    label="Seção Eleitoral"
                    value={employeeData.secaoEleitoral ?? ''}
                    onChange={(v) => updateField('secaoEleitoral', v)}
                  />
                </div>
              )}
            </div>

            {/* Certificado Reservista */}
            {employeeData.sexo === 'Masculino' && (
              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <h4
                  className={`${designTokens.typography.heading.h5} mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300`}
                >
                  <FaIdCard className="text-red-500" />
                  Certificado de Reservista
                </h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputField
                    label="Número do Certificado"
                    value={employeeData.certificadoReservista ?? ''}
                    onChange={(v) => updateField('certificadoReservista', v)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Dependentes - Edição */}
      <Card variant="elevated">
        <SectionHeader
          title="Dependentes"
          subtitle="Lista de dependentes (formato JSON)"
          icon={<FaUser />}
        />

        <div className="mt-6">
          {/* label associado ao textarea via htmlFor/id (mantido) */}
          <label
            htmlFor="dependentesJson"
            className={`block ${designTokens.typography.label} mb-2 text-gray-700 dark:text-gray-200`}
          >
            Lista de Dependentes (formato JSON)
          </label>
          <textarea
            id="dependentesJson"
            value={
              Array.isArray(employeeData.dependentes)
                ? JSON.stringify(employeeData.dependentes, null, 2)
                : (employeeData.dependentes as unknown as string) ?? ''
            }
            onChange={(e) => updateField('dependentes', e.target.value)}
            className={`
              w-full rounded-lg border px-4 py-3 text-sm ${designTokens.transitions.normal}
              resize-none border-gray-300 bg-white text-gray-900
              placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 
              focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:text-white
              dark:placeholder-gray-400
            `}
            rows={6}
            placeholder={`Exemplo:
[
  {
    "nome": "Nome do Dependente",
    "dataNascimento": "2000-01-01",
    "cpf": "000.000.000-00"
  }
]`}
          />
        </div>
      </Card>
    </div>
  );
};

export default DadosPessoaisSection;
