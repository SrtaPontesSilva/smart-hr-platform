import React, { useState } from 'react';
import {
  FaBriefcase,
  FaDollarSign,
  FaBuilding,
  FaHandshake,
  FaUtensils,
  FaHeartbeat,
  FaCreditCard,
  FaUsers,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaInfoCircle,
  FaPlus,
  FaTrash,
  FaPercentage,
  FaMoneyBillWave,
  FaCalendarAlt
} from 'react-icons/fa';

import {
  Card,
  SectionHeader,
  InputField,
  SelectField,
  Button,
  Toggle,
  EmptyState,
  designTokens
} from './DesignSystem';
import { EmployeeFull } from './EmployeeProfilePage';

interface Props {
  employeeData: EmployeeFull;
  isEditing: boolean;
  updateField: (field: keyof EmployeeFull, value: any) => void;
  updateNested: (path: (string | number)[], value: any) => void;
}

interface ContatoEmergencia {
  nome: string;
  telefone: string;
  email: string;
  parentesco: string;
}

interface DataDisplayProps {
  label: string;
  value: any;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  variant?: 'default' | 'currency' | 'highlight';
}

const DataDisplay: React.FC<DataDisplayProps> = ({
  label,
  value,
  icon,
  prefix,
  suffix,
  variant = 'default'
}) => {
  const getValueClasses = () => {
    switch (variant) {
      case 'currency':
        return 'text-lg font-semibold text-green-600 dark:text-green-400';
      case 'highlight':
        return 'text-sm font-medium text-blue-600 dark:text-blue-400';
      default:
        return 'text-sm text-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-sm text-gray-400">{icon}</span>}
        <span className={`${designTokens.typography.label} text-gray-600 dark:text-gray-400`}>
          {label}:
        </span>
      </div>
      <p className={`${getValueClasses()} ${icon ? 'pl-6' : ''}`}>
        {prefix}{value || '-'}{suffix}
      </p>
    </div>
  );
};

interface BenefitCardProps {
  title: string;
  icon: React.ReactNode;
  active: boolean;
  value?: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'yellow';
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  title,
  icon,
  active,
  value,
  subtitle,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: active
      ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400',
    green: active
      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400',
    purple: active
      ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400',
    yellow: active
      ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400',
  };

  return (
    <div className={`rounded-xl border p-4 ${designTokens.transitions.normal} ${colorClasses[color]}`}>
      <div className="mb-2 flex items-center gap-3">
        <div className="text-lg">{icon}</div>
        <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
      </div>
      {active ? (
        <div>
          {value != null && (
            <p className="text-sm font-semibold">
              {typeof value === 'number' ? `R$ ${value.toLocaleString('pt-BR')}` : value}
            </p>
          )}
          {subtitle && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">Não possui</p>
      )}
    </div>
  );
};

export const InformacoesComplementaresSection: React.FC<Props> = ({
  employeeData,
  isEditing,
  updateField,
  updateNested
}) => {
  const [expandedSections, setExpandedSections] = useState({
    salario: true,
    contrato: true,
    beneficios: false,
    responsavel: false,
    contatos: false
  });

  const defaultInfo = {
    tipoContrato: '',
    cnpj: '',
    menorDeIdade: false,
    responsavel: {
      nome: '',
      cpfRg: '',
      endereco: '',
      telefone: '',
      email: ''
    },
    contatosEmergencia: [] as ContatoEmergencia[],
    comissao: { possui: false, forma: '' },
    valeAlimentacao: { possui: false, valor: 0 },
    planoDeSaude: { possui: false, nome: '', valorTotal: 0, valorDescontado: 0 },
    formaPagamento: 'Transferência Bancária'
  };

  const info = employeeData.informacoesAdicionais ?? defaultInfo;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const tipoContratoOptions = [
    { value: 'CLT', label: 'CLT - Consolidação das Leis do Trabalho' },
    { value: 'PJ', label: 'PJ - Pessoa Jurídica' },
    { value: 'Estágio', label: 'Contrato de Estágio' },
    { value: 'Aprendiz', label: 'Contrato de Aprendizagem' },
    { value: 'Temporário', label: 'Contrato Temporário' },
    { value: 'Terceirizado', label: 'Terceirizado' },
    { value: 'Freelancer', label: 'Freelancer' }
  ];

  const formaPagamentoOptions = [
    { value: 'Transferência Bancária', label: 'Transferência Bancária' },
    { value: 'PIX', label: 'PIX' },
    { value: 'Dinheiro', label: 'Dinheiro' },
    { value: 'Cheque', label: 'Cheque' },
    { value: 'Cartão Pré-pago', label: 'Cartão Pré-pago' }
  ];

  const comissaoFormaOptions = [
    { value: 'Percentual sobre vendas', label: 'Percentual sobre vendas' },
    { value: 'Valor fixo por venda', label: 'Valor fixo por venda' },
    { value: 'Meta mensal', label: 'Meta mensal' },
    { value: 'Meta trimestral', label: 'Meta trimestral' },
    { value: 'Bonificação por performance', label: 'Bonificação por performance' },
    { value: 'Outro', label: 'Outro' }
  ];

  const parentescoOptions = [
    { value: 'Pai', label: 'Pai' },
    { value: 'Mãe', label: 'Mãe' },
    { value: 'Cônjuge', label: 'Cônjuge' },
    { value: 'Filho(a)', label: 'Filho(a)' },
    { value: 'Irmão(ã)', label: 'Irmão(ã)' },
    { value: 'Avô/Avó', label: 'Avô/Avó' },
    { value: 'Tio(a)', label: 'Tio(a)' },
    { value: 'Primo(a)', label: 'Primo(a)' },
    { value: 'Amigo(a)', label: 'Amigo(a)' },
    { value: 'Outro', label: 'Outro' }
  ];

  const addContatoEmergencia = () => {
    const novoContato: ContatoEmergencia = {
      nome: '',
      telefone: '',
      email: '',
      parentesco: ''
    };
    const contatosAtuais = info.contatosEmergencia || [];
    updateNested(['informacoesAdicionais', 'contatosEmergencia'], [...contatosAtuais, novoContato]);
  };

  const removeContatoEmergencia = (index: number) => {
    const contatosAtuais = info.contatosEmergencia || [];
    updateNested(
      ['informacoesAdicionais', 'contatosEmergencia'],
      contatosAtuais.filter((_, i) => i !== index)
    );
  };

  const updateContatoEmergencia = (index: number, field: keyof ContatoEmergencia, value: string) => {
    const contatosAtuais = info.contatosEmergencia || [];
    const contatosAtualizados = contatosAtuais.map((contato, i) =>
      i === index ? { ...contato, [field]: value } : contato
    );
    updateNested(['informacoesAdicionais', 'contatosEmergencia'], contatosAtualizados);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Informações Salariais */}
        <Card variant="elevated">
          <SectionHeader
            title="Informações Salariais e Financeiras"
            subtitle="Dados sobre remuneração e forma de pagamento"
            icon={<FaDollarSign />}
            badge={`R$ ${(employeeData.salario || 0).toLocaleString('pt-BR')}`}
            collapsible
            isExpanded={expandedSections.salario}
            onToggle={() => toggleSection('salario')}
          />
          
          {expandedSections.salario && (
            <div className="mt-6">
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <DataDisplay 
                  label="Salário Base" 
                  value={`R$ ${(employeeData.salario || 0).toLocaleString('pt-BR')}`}
                  icon={<FaMoneyBillWave />}
                  variant="currency"
                />
                <DataDisplay 
                  label="Forma de Pagamento" 
                  value={info.formaPagamento}
                  icon={<FaCreditCard />}
                />
              </div>

              {/* Dados Bancários */}
              {employeeData.dadosBancarios && (
                <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                  <h4 className={`${designTokens.typography.heading.h5} mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300`}>
                    <FaBuilding className="text-blue-500" />
                    Dados Bancários
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <DataDisplay label="Banco" value={employeeData.dadosBancarios.banco} />
                    <DataDisplay label="Agência" value={employeeData.dadosBancarios.agencia} />
                    <DataDisplay label="Conta" value={employeeData.dadosBancarios.conta} />
                  </div>
                </div>
              )}

              {/* Benefícios Adicionais */}
              {(employeeData.valoresVT || employeeData.valoresVR) && (
                <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                  <h4 className={`${designTokens.typography.heading.h5} mb-4 text-gray-700 dark:text-gray-300`}>
                    Auxílios
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {employeeData.valoresVT && (
                      <DataDisplay 
                        label="Vale Transporte" 
                        value={`R$ ${employeeData.valoresVT.toLocaleString('pt-BR')}`}
                        variant="currency"
                      />
                    )}
                    {employeeData.valoresVR && (
                      <DataDisplay 
                        label="Vale Refeição" 
                        value={`R$ ${employeeData.valoresVR.toLocaleString('pt-BR')}`}
                        variant="currency"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Informações Contratuais */}
        <Card variant="elevated">
          <SectionHeader
            title="Informações Contratuais"
            subtitle="Detalhes sobre o contrato de trabalho"
            icon={<FaHandshake />}
            badge={info.tipoContrato || 'Não informado'}
            collapsible
            isExpanded={expandedSections.contrato}
            onToggle={() => toggleSection('contrato')}
          />
          
          {expandedSections.contrato && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DataDisplay 
                  label="Tipo de Contrato" 
                  value={info.tipoContrato}
                  icon={<FaBriefcase />}
                  variant="highlight"
                />
                <DataDisplay 
                  label="Data de Admissão" 
                  value={employeeData.dataAdmissao}
                  icon={<FaCalendarAlt />}
                />
                {info.cnpj && (
                  <DataDisplay label="CNPJ" value={info.cnpj} icon={<FaBuilding />} />
                )}
              </div>
              
              {info.menorDeIdade && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-3">
                    <FaInfoCircle className="text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Colaborador menor de idade
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Benefícios e Vantagens */}
        <Card variant="elevated">
          <SectionHeader
            title="Benefícios e Vantagens"
            subtitle="Planos e benefícios disponíveis"
            icon={<FaHeartbeat />}
            collapsible
            isExpanded={expandedSections.beneficios}
            onToggle={() => toggleSection('beneficios')}
          />
          
          {expandedSections.beneficios && (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <BenefitCard
                title="Vale Alimentação"
                icon={<FaUtensils />}
                active={info.valeAlimentacao?.possui || false}
                value={info.valeAlimentacao?.valor}
                color="green"
              />
              
              <BenefitCard
                title="Plano de Saúde"
                icon={<FaHeartbeat />}
                active={info.planoDeSaude?.possui || false}
                value={info.planoDeSaude?.nome}
                subtitle={info.planoDeSaude?.valorDescontado ? 
                  `Desconto: R$ ${info.planoDeSaude.valorDescontado.toLocaleString('pt-BR')}` : 
                  undefined
                }
                color="blue"
              />
              
              <BenefitCard
                title="Comissão"
                icon={<FaPercentage />}
                active={info.comissao?.possui || false}
                value={info.comissao?.forma}
                color="purple"
              />
            </div>
          )}
        </Card>

        {/* Contatos de Emergência */}
        {info.contatosEmergencia && info.contatosEmergencia.length > 0 && (
          <Card variant="elevated">
            <SectionHeader
              title="Contatos de Emergência"
              subtitle={`${info.contatosEmergencia.length} contato(s) cadastrado(s)`}
              icon={<FaPhone />}
              badge={info.contatosEmergencia.length}
              collapsible
              isExpanded={expandedSections.contatos}
              onToggle={() => toggleSection('contatos')}
            />
            
            {expandedSections.contatos && (
              <div className="mt-6 space-y-4">
                {info.contatosEmergencia.map((contato, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <DataDisplay label="Nome" value={contato.nome} icon={<FaUser />} />
                      <DataDisplay label="Parentesco" value={contato.parentesco} />
                      <DataDisplay label="Telefone" value={contato.telefone} icon={<FaPhone />} />
                      <DataDisplay label="E-mail" value={contato.email} icon={<FaEnvelope />} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    );
  }

  // Modo de edição
  return (
    <div className="space-y-6">
      {/* Informações Salariais - Edição */}
      <Card variant="elevated">
        <SectionHeader
          title="Informações Salariais e Financeiras"
          subtitle="Configure dados sobre remuneração"
          icon={<FaDollarSign />}
          collapsible
          isExpanded={expandedSections.salario}
          onToggle={() => toggleSection('salario')}
        />
        
        {expandedSections.salario && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputField
                label="Salário Base"
                type="number"
                value={employeeData.salario || 0}
                onChange={(v) => updateField('salario', Number(v))}
                icon={<FaDollarSign />}
                placeholder="Ex: 5000"
                required
              />
              <SelectField
                label="Forma de Pagamento"
                value={info.formaPagamento || ''}
                onChange={(v) => updateNested(['informacoesAdicionais', 'formaPagamento'], v)}
                options={formaPagamentoOptions}
                required
              />
            </div>

            {/* Auxílios */}
            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
              <h4 className={`${designTokens.typography.heading.h5} mb-4 text-gray-700 dark:text-gray-300`}>
                Auxílios
              </h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputField
                  label="Vale Transporte (R$)"
                  type="number"
                  value={employeeData.valoresVT || 0}
                  onChange={(v) => updateField('valoresVT', Number(v))}
                  icon={<FaDollarSign />}
                />
                <InputField
                  label="Vale Refeição (R$)"
                  type="number"
                  value={employeeData.valoresVR || 0}
                  onChange={(v) => updateField('valoresVR', Number(v))}
                  icon={<FaDollarSign />}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Informações Contratuais - Edição */}
      <Card variant="elevated">
        <SectionHeader
          title="Informações Contratuais"
          subtitle="Configure detalhes do contrato"
          icon={<FaHandshake />}
          collapsible
          isExpanded={expandedSections.contrato}
          onToggle={() => toggleSection('contrato')}
        />
        
        {expandedSections.contrato && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SelectField
                label="Tipo de Contrato"
                value={info.tipoContrato || ''}
                onChange={(v) => updateNested(['informacoesAdicionais', 'tipoContrato'], v)}
                options={tipoContratoOptions}
                required
              />
              <InputField
                label="CNPJ (se aplicável)"
                value={info.cnpj || ''}
                onChange={(v) => updateNested(['informacoesAdicionais', 'cnpj'], v)}
                placeholder="00.000.000/0000-00"
                icon={<FaBuilding />}
              />
            </div>
            
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaInfoCircle className="text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Colaborador menor de idade?
                    </span>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Marque se o colaborador é menor de 18 anos
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={info.menorDeIdade || false}
                  onChange={(checked) => updateNested(['informacoesAdicionais', 'menorDeIdade'], checked)}
                  label={info.menorDeIdade ? 'Sim' : 'Não'}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Benefícios - Edição */}
      <Card variant="elevated">
        <SectionHeader
          title="Benefícios e Vantagens"
          subtitle="Configure benefícios disponíveis"
          icon={<FaHeartbeat />}
          collapsible
          isExpanded={expandedSections.beneficios}
          onToggle={() => toggleSection('beneficios')}
        />
        
        {expandedSections.beneficios && (
          <div className="mt-6 space-y-6">
            {/* Vale Alimentação */}
            <div className={`rounded-xl border p-6 ${designTokens.transitions.normal} ${
              info.valeAlimentacao?.possui 
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
            }`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaUtensils className="text-lg text-green-600 dark:text-green-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Vale Alimentação</span>
                </div>
                <Toggle
                  checked={info.valeAlimentacao?.possui || false}
                  onChange={(checked) => updateNested(['informacoesAdicionais', 'valeAlimentacao', 'possui'], checked)}
                  label={info.valeAlimentacao?.possui ? 'Ativo' : 'Inativo'}
                />
              </div>
              
              {info.valeAlimentacao?.possui && (
                <InputField
                  label="Valor Mensal (R$)"
                  type="number"
                  value={info.valeAlimentacao.valor || 0}
                  onChange={(v) => updateNested(['informacoesAdicionais', 'valeAlimentacao', 'valor'], Number(v))}
                  placeholder="Ex: 500"
                  icon={<FaDollarSign />}
                />
              )}
            </div>

            {/* Plano de Saúde */}
            <div className={`rounded-xl border p-6 ${designTokens.transitions.normal} ${
              info.planoDeSaude?.possui 
                ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' 
                : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
            }`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaHeartbeat className="text-lg text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Plano de Saúde</span>
                </div>
                <Toggle
                  checked={info.planoDeSaude?.possui || false}
                  onChange={(checked) => updateNested(['informacoesAdicionais', 'planoDeSaude', 'possui'], checked)}
                  label={info.planoDeSaude?.possui ? 'Ativo' : 'Inativo'}
                />
              </div>
              
              {info.planoDeSaude?.possui && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <InputField
                    label="Nome do Plano"
                    value={info.planoDeSaude.nome || ''}
                    onChange={(v) => updateNested(['informacoesAdicionais', 'planoDeSaude', 'nome'], v)}
                    placeholder="Ex: Unimed, Bradesco Saúde"
                  />
                  <InputField
                    label="Valor Total (R$)"
                    type="number"
                    value={info.planoDeSaude.valorTotal || 0}
                    onChange={(v) => updateNested(['informacoesAdicionais', 'planoDeSaude', 'valorTotal'], Number(v))}
                    placeholder="Ex: 300"
                    icon={<FaDollarSign />}
                  />
                  <InputField
                    label="Valor Descontado (R$)"
                    type="number"
                    value={info.planoDeSaude.valorDescontado || 0}
                    onChange={(v) => updateNested(['informacoesAdicionais', 'planoDeSaude', 'valorDescontado'], Number(v))}
                    placeholder="Ex: 150"
                    icon={<FaDollarSign />}
                  />
                </div>
              )}
            </div>

            {/* Comissão */}
            <div className={`rounded-xl border p-6 ${designTokens.transitions.normal} ${
              info.comissao?.possui 
                ? 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20' 
                : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
            }`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaPercentage className="text-lg text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Comissão</span>
                </div>
                <Toggle
                  checked={info.comissao?.possui || false}
                  onChange={(checked) => updateNested(['informacoesAdicionais', 'comissao', 'possui'], checked)}
                  label={info.comissao?.possui ? 'Ativo' : 'Inativo'}
                />
              </div>
              
              {info.comissao?.possui && (
                <SelectField
                  label="Forma de Comissão"
                  value={info.comissao.forma || ''}
                  onChange={(v) => updateNested(['informacoesAdicionais', 'comissao', 'forma'], v)}
                  options={comissaoFormaOptions}
                />
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Contatos de Emergência - Edição */}
      <Card variant="elevated">
        <SectionHeader
          title="Contatos de Emergência"
          subtitle="Configure contatos para situações de emergência"
          icon={<FaPhone />}
          badge={info.contatosEmergencia?.length || 0}
          collapsible
          isExpanded={expandedSections.contatos}
          onToggle={() => toggleSection('contatos')}
        />
        
        {expandedSections.contatos && (
          <div className="mt-6 space-y-4">
            {info.contatosEmergencia && info.contatosEmergencia.length > 0 ? (
              info.contatosEmergencia.map((contato, index) => (
                <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className={`${designTokens.typography.heading.h5} text-gray-900 dark:text-gray-100`}>
                      Contato #{index + 1}
                    </h4>
                    <Button
                      onClick={() => removeContatoEmergencia(index)}
                      variant="danger"
                      size="sm"
                      icon={<FaTrash />}
                    >
                      Remover
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputField
                      label="Nome Completo"
                      value={contato.nome}
                      onChange={(v) => updateContatoEmergencia(index, 'nome', v)}
                      icon={<FaUsers />}
                      required
                    />
                    <SelectField
                      label="Parentesco"
                      value={contato.parentesco}
                      onChange={(v) => updateContatoEmergencia(index, 'parentesco', v)}
                      options={parentescoOptions}
                      required
                    />
                    <InputField
                      label="Telefone"
                      value={contato.telefone}
                      onChange={(v) => updateContatoEmergencia(index, 'telefone', v)}
                      icon={<FaPhone />}
                      placeholder="(11) 99999-9999"
                      required
                    />
                    <InputField
                      label="E-mail"
                      value={contato.email}
                      onChange={(v) => updateContatoEmergencia(index, 'email', v)}
                      icon={<FaEnvelope />}
                      type="email"
                    />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<FaPhone />}
                title="Nenhum contato de emergência cadastrado"
                subtitle="Adicione contatos que possam ser acionados em caso de emergência"
              />
            )}
            
            <Button
              onClick={addContatoEmergencia}
              variant="secondary"
              size="md"
              icon={<FaPlus />}
              fullWidth
            >
              Adicionar Contato de Emergência
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}