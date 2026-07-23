// src/pages/rh/EmployeeProfilePage.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { FaSearch, FaUsers, FaUser, FaBriefcase, FaEye, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import PageHeader from '../../layout/RH/PageHeader';
import ResumeModal from '../../shared/components/modals/ResumeModal';
import useLocalStorage from '../../shared/hooks/useLocalStorage';
import { Resume } from '../../shared/types/resume';

// Interface com todas as informações do funcionário, incluindo os novos campos.
export interface EmployeeFull {
  id: number;
  nome: string;
  cargo: string;
  telefone: string;
  pontuacaoIA: number;
  curriculo: string;
  observacoes: string;
  email: string;
  dataAdmissao: string;
  iaData: {
    raiva: number;
    felicidade: number;
    tristeza: number;
    medo: number;
    nojo: number;
  };
  observacoesDetalhadas: {
    id: number;
    data: string;
    texto: string;
  }[];
  salario: number;
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
  };
  valoresVT: number;
  valoresVR: number;
  contratoPdf: string;
  documentosPessoais: string[];
  cpf: string;
  rg: string;
  dataExpedicaoRG?: string;
  ufRG?: string;
  nomeMae?: string;
  nomePai?: string;
  endereco?: string;
  cep?: string;
  dataNascimento?: string;
  localNascimento?: string;
  sexo?: string;
  estadoCivil?: string;
  grauInstrucao?: string;
  primeiroEmprego?: boolean;
  numeroPis?: string;
  certificadoReservista?: string;
  tituloEleitor?: string;
  zonaEleitoral?: string;
  secaoEleitoral?: string;
  cnhNumero?: string;
  cnhValidade?: string;
  cnhUF?: string;
  cnhCategoria?: string;
  cnhDataExpedicao?: string;
  cnhPrimeiraHabilitacao?: string;
  raca?: string;
  dependentes?: {
    nome: string;
    dataNascimento: string;
    cpf: string;
  }[];
  // Atualização: propriedade informacoesAdicionais tornada obrigatória
  informacoesAdicionais: {
    menorDeIdade: boolean;
    responsavel?: {
      nome: string;
      cpfRg: string;
      endereco: string;
      telefone: string;
      email: string;
    };
    contatosEmergencia: {
      nome: string;
      telefone: string;
      email: string;
      parentesco: string;
    }[];
    tipoContrato: string;
    cnpj?: string;
    comissao: {
      possui: boolean;
      forma?: string;
    };
    valeAlimentacao: {
      possui: boolean;
      valor?: number;
    };
    planoDeSaude: {
      possui: boolean;
      nome?: string;
      valorTotal?: number;
      valorDescontado?: number;
    };
    formaPagamento: string;
  };
  documentosAnexos?: {
    title: string;
    filename: string;
    date: string;
  }[];
}

// Lista padrão (vazia) para evitar omissões e garantir compilação.
const defaultEmployees: EmployeeFull[] = [];

const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();

  const [employees] = useLocalStorage<EmployeeFull[]>('employees_full', defaultEmployees);
  const [search, setSearch] = useLocalStorage<string>('employee_search', '');
  const [filterCargo, setFilterCargo] = useLocalStorage<string>('employee_filterCargo', 'Todos');
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  // Estatísticas para o cabeçalho
  const stats = useMemo(() => {
    const total = employees.length;
    const cargosUnicos = new Set(employees.map(emp => emp.cargo)).size;
    const mediaPontuacao = employees.length > 0 
      ? Math.round(employees.reduce((acc, emp) => acc + emp.pontuacaoIA, 0) / employees.length)
      : 0;
    const comObservacoes = employees.filter(emp => emp.observacoesDetalhadas && emp.observacoesDetalhadas.length > 0).length;

    return { total, cargosUnicos, mediaPontuacao, comObservacoes };
  }, [employees]);

  // Lista de cargos únicos para o filtro
  const cargosDisponiveis = useMemo(() => {
    const cargos = new Set<string>(['Todos']);
    employees.forEach(emp => cargos.add(emp.cargo));
    return Array.from(cargos);
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: EmployeeFull) => {
      const matchNome = emp.nome.toLowerCase().includes(search.toLowerCase());
      const matchCargo = filterCargo === 'Todos' || emp.cargo === filterCargo;
      return matchNome && matchCargo;
    });
  }, [employees, search, filterCargo]);

  const handleVerCurriculo = useCallback((emp: EmployeeFull) => {
    const calculatedAge = emp.dataNascimento
      ? new Date().getFullYear() - new Date(emp.dataNascimento).getFullYear()
      : 0;
    const resume: Resume = {
      id: emp.id.toString(),
      candidateName: emp.nome,
      vacancy: emp.cargo,
      age: calculatedAge,
      submissionDate: emp.dataAdmissao,
      fileType: 'pdf',
      fileUrl: emp.curriculo,
    };
    setSelectedResume(resume);
  }, []);

  // Função no-op para atender a assinatura () => void sem violar no-empty-function
  const noop = useCallback((): void => { void 0; }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-50 dark:bg-green-900/20';
    if (score >= 80) return 'bg-blue-50 dark:bg-blue-900/20';
    if (score >= 70) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-orange-50 dark:bg-orange-900/20';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Padronizado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageHeader
          title="Lista de Funcionários"
          subtitle="Gerencie perfis e informações dos colaboradores"
          actions={
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaUsers className="w-4 h-4 text-slate-600 dark:text-slate-400 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.total}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaBriefcase className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.cargosUnicos}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Cargos</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.mediaPontuacao}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Média IA</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaInfoCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.comObservacoes}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">C/ Obs.</div>
              </div>
            </div>
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Filtros e Controles */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                         focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                aria-label="Buscar funcionário por nome"
              />
            </div>

            {/* Filtro de Cargo */}
            <div className="flex items-center gap-3">
              <FaBriefcase className="text-slate-500 w-4 h-4" />
              <select
                value={filterCargo}
                onChange={(e) => setFilterCargo(e.target.value)}
                className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                         focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                aria-label="Filtrar por cargo"
              >
                {cargosDisponiveis.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo === 'Todos' ? 'Todos os Cargos' : cargo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Funcionários */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Funcionários ({filteredEmployees.length})
            </h2>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <FaUser className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 mb-2">Nenhum funcionário encontrado</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((emp: EmployeeFull) => (
                <div
                  key={emp.id}
                  className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600 
                           hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Header do Card */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {emp.nome}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {emp.cargo}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-200">
                        {emp.telefone}
                      </p>
                    </div>
                    
                    {/* Score Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBackground(emp.pontuacaoIA)} ${getScoreColor(emp.pontuacaoIA)}`}>
                      {emp.pontuacaoIA}
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email:</p>
                      <p className="text-sm text-slate-600 dark:text-slate-200 truncate">{emp.email}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Data de Admissão:</p>
                      <p className="text-sm text-slate-600 dark:text-slate-200">
                        {new Date(emp.dataAdmissao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {/* Observações */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Observações Recentes:
                    </p>
                    <div className="max-h-20 overflow-y-auto bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-3">
                      {emp.observacoesDetalhadas && emp.observacoesDetalhadas.length > 0 ? (
                        <div className="space-y-2">
                          {emp.observacoesDetalhadas
                            .slice()
                            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                            .slice(0, 2)
                            .map((obs) => (
                              <div key={obs.id} className="text-xs">
                                <p className="text-slate-400 dark:text-slate-500">{obs.data}</p>
                                <p className="text-slate-700 dark:text-slate-300">{obs.texto}</p>
                              </div>
                            ))}
                          {emp.observacoesDetalhadas.length > 2 && (
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              +{emp.observacoesDetalhadas.length - 2} observações
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                          Nenhuma observação disponível
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleVerCurriculo(emp)}
                      className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium
                               bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300
                               hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                    >
                      <FaEye className="w-4 h-4" />
                      Currículo
                    </button>
                    
                    <button
                      onClick={() => navigate(`/rh/employee/${emp.id}`)}
                      className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium
                               bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300
                               hover:bg-slate-200 dark:hover:bg-slate-500 rounded-lg transition-colors"
                    >
                      <FaInfoCircle className="w-4 h-4" />
                      Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estatísticas Resumidas */}
        {employees.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredEmployees.length}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Exibindo</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {filteredEmployees.filter(emp => emp.pontuacaoIA >= 80).length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Score 80+</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {new Set(filteredEmployees.map(emp => emp.cargo)).size}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Cargos Diferentes</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {filteredEmployees.filter(emp => 
                  emp.observacoesDetalhadas && emp.observacoesDetalhadas.length > 0
                ).length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Com Observações</div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Currículo */}
      {selectedResume && (
        <ResumeModal
          resume={selectedResume}
          onClose={() => setSelectedResume(null)}
          onPrev={noop}
          onNext={noop}
          hasPrev={false}
          hasNext={false}
        />
      )}
    </div>
  );
};

export default EmployeeListPage;