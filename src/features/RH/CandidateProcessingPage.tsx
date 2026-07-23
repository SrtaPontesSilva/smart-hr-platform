import { 
  Award,
  Briefcase,
  Calendar,
  Eye,
  Filter,
  FileText,
  MapPin,
  Monitor,
  Search,
  Send,
  Star,
  StarOff,
  Users,
  X,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '../../layout/RH/PageHeader';
import ResumeModal from '../../shared/components/modals/ResumeModal';
import useLocalStorage from '../../shared/hooks/useLocalStorage';
import { Resume } from '../../shared/types/resume';

interface Candidate {
  id: number;
  nome: string;
  vaga: string;
  pontuacaoIA?: number;
  comentariosInternos?: string;
  dataNascimento?: string;
  dataAdmissao?: string;
  curriculo?: string;
}

interface InterviewData {
  candidateId: number;
  candidateName: string;
  date: string;
  time: string;
  type: 'online' | 'presencial';
  location?: string;
  meetingLink?: string;
  interviewer: string;
  notes?: string;
}

const CandidateProcessingPage: React.FC = () => {
  const [candidatos, _setCandidatos] = useLocalStorage<Candidate[]>(
    'candidate_processing_candidates',
    [
      {
        id: 9999,
        nome: 'Teste Candidato',
        vaga: 'Analista',
        pontuacaoIA: 88,
        dataNascimento: '1995-04-10',
        dataAdmissao: '2025-07-25',
        curriculo: '/curriculos/teste.pdf',
        comentariosInternos: 'Candidato usado para testes do botão de contratação.',
      },
    ],
  );

  // FILTROS GERAIS DOS CARDS (lista principal)
  const [filtro, setFiltro] = useLocalStorage<string>('candidate_processing_filter', '');
  const [vagaSelecionada, setVagaSelecionada] = useLocalStorage<string>(
    'candidate_processing_vagaSelecionada',
    'Todas',
  );

  // CONTROLES DO PÓDIO
  const [podiumVaga, setPodiumVaga] = useLocalStorage<string>('candidate_processing_podium_vaga', 'Todas');
  const [topN, setTopN] = useLocalStorage<number>('candidate_processing_podium_topN', 5);
  const [showPodium, setShowPodium] = useState(true);

  // PIN: candidato fixado por vaga
  const [pinnedByVaga, setPinnedByVaga] = useLocalStorage<Record<string, number | null>>(
    'candidate_processing_pinned_by_vaga',
    {},
  );

  // MODAL STATES
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState<Candidate | null>(null);

  // INTERVIEW FORM DATA
  const [interviewData, setInterviewData] = useState<Partial<InterviewData>>({
    date: '',
    time: '',
    type: 'online',
    location: '',
    meetingLink: '',
    interviewer: '',
    notes: '',
  });

  const navigate = useNavigate();

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return 0;
    return new Date().getFullYear() - new Date(birthDate).getFullYear();
  };

  const ordenarPorPontuacao = useCallback((a: Candidate, b: Candidate) => {
    const pa = a.pontuacaoIA ?? 0;
    const pb = b.pontuacaoIA ?? 0;
    if (pb !== pa) return pb - pa;
    return a.nome.localeCompare(b.nome);
  }, []);

  const vagasDisponiveis = useMemo(() => {
    const set = new Set<string>(['Todas']);
    candidatos.forEach((c) => set.add(c.vaga));
    return Array.from(set);
  }, [candidatos]);

  // PÓDIO
  const podiumCandidatos = useMemo(() => {
    const base = [...candidatos].sort(ordenarPorPontuacao);
    const filtrados = podiumVaga === 'Todas' ? base : base.filter((c) => c.vaga === podiumVaga);

    let arr = filtrados;
    if (podiumVaga !== 'Todas') {
      const pinnedId = pinnedByVaga[podiumVaga];
      if (pinnedId) {
        const pinnedIdx = arr.findIndex((c) => c.id === pinnedId);
        if (pinnedIdx >= 0) {
          const pinned = arr[pinnedIdx];
          arr = [pinned, ...arr.filter((c) => c.id !== pinned.id)];
        }
      }
    }

    return arr.slice(0, Number(topN) || 5);
  }, [candidatos, ordenarPorPontuacao, podiumVaga, topN, pinnedByVaga]);

  // Lista principal
  const candidatosFiltrados = useMemo(() => {
    return candidatos.filter((cand) => {
      const matchNome = cand.nome.toLowerCase().includes(filtro.toLowerCase());
      const matchVaga = vagaSelecionada === 'Todas' || cand.vaga === vagaSelecionada;
      return matchNome && matchVaga;
    });
  }, [candidatos, filtro, vagaSelecionada]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = candidatos.length;
    const comPontuacao = candidatos.filter(c => c.pontuacaoIA).length;
    const media = candidatos.reduce((acc, c) => acc + (c.pontuacaoIA || 0), 0) / comPontuacao || 0;
    const candidatos80Plus = candidatos.filter(c => (c.pontuacaoIA || 0) >= 80).length;

    return { total, comPontuacao, media: Math.round(media), candidatos80Plus };
  }, [candidatos]);

  const handleVerCurriculo = useCallback((cand: Candidate) => {
    const resume: Resume = {
      id: cand.id.toString(),
      candidateName: cand.nome,
      vacancy: cand.vaga,
      age: calculateAge(cand.dataNascimento),
      submissionDate: cand.dataAdmissao || '',
      fileType: 'pdf',
      fileUrl: cand.curriculo || '',
    };
    setSelectedResume(resume);
  }, []);

  const handleSelecionarEntrevista = (cand: Candidate) => {
    setSelectedCandidateForInterview(cand);
    setInterviewData({
      candidateId: cand.id,
      candidateName: cand.nome,
      date: '',
      time: '',
      type: 'online',
      location: '',
      meetingLink: '',
      interviewer: '',
      notes: '',
    });
    setInterviewModalOpen(true);
  };

  const handleEnviarFichaCadastral = (cand: Candidate) => {
    console.info(`Ficha cadastral enviada ao candidato ${cand.nome}.`);
    // TODO: Implementar envio da ficha cadastral
  };

  const handleEnviarParaContratacao = (cand: Candidate) => {
    try {
      const contrato = {
        id: Date.now(),
        nome: cand.nome,
        contratoGerado: false,
        contratoAssinadoEmpresa: false,
        contratoAssinadoCandidato: false,
        historico: [`Enviado para contratação em ${new Date().toLocaleDateString()}`],
      };

      const anteriores = JSON.parse(localStorage.getItem('contrato_candidatos') || '[]');
      const atualizados = Array.isArray(anteriores) ? [...anteriores, contrato] : [contrato];

      localStorage.setItem('contrato_candidatos', JSON.stringify(atualizados));

      alert(`Candidato ${cand.nome} foi enviado para a etapa de contratação.`);
      navigate('/rh/contratacao');
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
    }
  };

  const togglePin = (cand: Candidate) => {
    setPinnedByVaga((prev) => {
      const next = { ...prev };
      if (podiumVaga === 'Todas') return next;
      next[podiumVaga] = next[podiumVaga] === cand.id ? null : cand.id;
      return next;
    });
  };

  const closeInterviewModal = () => {
    setInterviewModalOpen(false);
    setSelectedCandidateForInterview(null);
    setInterviewData({
      date: '',
      time: '',
      type: 'online',
      location: '',
      meetingLink: '',
      interviewer: '',
      notes: '',
    });
  };

  const handleScheduleInterview = () => {
    console.log('Agendando entrevista:', interviewData);
    // TODO: Implementar envio do agendamento (email ou WhatsApp)
    alert(`Entrevista agendada para ${selectedCandidateForInterview?.nome}!`);
    closeInterviewModal();
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-500 dark:text-slate-400';
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getScoreBackground = (score?: number) => {
    if (!score) return 'bg-slate-100 dark:bg-slate-700';
    if (score >= 90) return 'bg-green-50 dark:bg-green-900/20';
    if (score >= 80) return 'bg-blue-50 dark:bg-blue-900/20';
    if (score >= 70) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-orange-50 dark:bg-orange-900/20';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header com PageHeader */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageHeader
          title="Processamento de Candidatos"
          subtitle="Gerencie e avalie candidatos com inteligência artificial"
          actions={
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <Users className="w-4 h-4 text-slate-600 dark:text-slate-400 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.total}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <Award className="w-4 h-4 text-primary-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.candidatos80Plus}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">80+ pontos</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.media}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Média IA</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{candidatosFiltrados.length}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Filtrados</div>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome do candidato..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                         focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                aria-label="Buscar por nome do candidato"
              />
            </div>

            {/* Filtro de Vaga */}
            <div className="flex items-center gap-3">
              <Filter className="text-slate-500 w-4 h-4" />
              <select
                value={vagaSelecionada}
                onChange={(e) => setVagaSelecionada(e.target.value)}
                className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                         focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                aria-label="Filtrar por vaga"
              >
                {vagasDisponiveis.map((vaga) => (
                  <option key={vaga} value={vaga}>
                    {vaga === 'Todas' ? 'Todas as Vagas' : vaga}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle Pódio */}
            <button
              onClick={() => setShowPodium(!showPodium)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showPodium
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {showPodium ? 'Ocultar' : 'Mostrar'} Pódio
            </button>
          </div>
        </div>

        {/* PÓDIO IA */}
        {showPodium && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-500" />
                  Ranking IA
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Top candidatos avaliados pela inteligência artificial
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Seletor Top N */}
                <select
                  value={topN}
                  onChange={(e) => setTopN(Number(e.target.value))}
                  className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2
                           bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                           focus:border-primary-500 outline-none text-sm"
                  aria-label="Quantidade no ranking"
                >
                  {[3, 5, 8, 10].map((n) => (
                    <option key={n} value={n}>Top {n}</option>
                  ))}
                </select>

                {/* Filtros por Área */}
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar ranking por vaga">
                  {vagasDisponiveis.map((vaga) => (
                    <button
                      key={vaga}
                      onClick={() => setPodiumVaga(vaga)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        podiumVaga === vaga
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {vaga === 'Todas' ? 'Todas' : vaga}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cards do Pódio */}
            {podiumCandidatos.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">Nenhum candidato encontrado para o filtro selecionado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {podiumCandidatos.map((cand, idx) => {
                  const pinned = podiumVaga !== 'Todas' && pinnedByVaga[podiumVaga] === cand.id;
                  const score = cand.pontuacaoIA || 0;

                  return (
                    <div
                      key={`podium-${cand.id}`}
                      className={`relative p-5 rounded-xl border transition-all duration-300 ${
                        idx === 0
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-300 dark:border-yellow-700 shadow-lg'
                          : idx === 1
                          ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 border-slate-300 dark:border-slate-600 shadow-md'
                          : idx === 2
                          ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border-orange-300 dark:border-orange-700 shadow-md'
                          : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md'
                      } hover:scale-[1.02]`}
                    >
                      {/* Badge de Posição */}
                      <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg ${
                        idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-slate-500' : idx === 2 ? 'bg-orange-500' : 'bg-primary-500'
                      }`}>
                        {idx + 1}
                      </div>

                      {/* Pin Button */}
                      {podiumVaga !== 'Todas' && (
                        <button
                          onClick={() => togglePin(cand)}
                          className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                          title={pinned ? 'Desafixar' : 'Fixar no topo'}
                          aria-label={pinned ? 'Desafixar candidato do topo' : 'Fixar candidato no topo'}
                        >
                          {pinned ? (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          ) : (
                            <StarOff className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      )}

                      {/* Conteúdo */}
                      <div className="pt-2">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 pr-8">
                          {cand.nome}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {cand.vaga}
                        </p>

                        {/* Score Badge */}
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getScoreBackground(score)} ${getScoreColor(score)}`}>
                          {score || 'N/A'} pts
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleVerCurriculo(cand)}
                              className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium
                                       bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300
                                       hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              Currículo
                            </button>
                            <button
                              onClick={() => handleSelecionarEntrevista(cand)}
                              className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium
                                       bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300
                                       hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                            >
                              <Calendar className="w-3 h-3" />
                              Entrevista
                            </button>
                          </div>

                          <button
                            onClick={() => handleEnviarFichaCadastral(cand)}
                            className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium
                                     bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300
                                     hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            Ficha Cadastral
                          </button>

                          <button
                            onClick={() => handleEnviarParaContratacao(cand)}
                            className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium
                                     bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm"
                          >
                            <Briefcase className="w-3 h-3" />
                            Contratar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Lista Principal de Candidatos */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Todos os Candidatos ({candidatosFiltrados.length})
            </h2>
          </div>

          {candidatosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 mb-2">Nenhum candidato encontrado</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Tente ajustar seus filtros de busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatosFiltrados.map((cand) => {
                const score = cand.pontuacaoIA || 0;

                return (
                  <div
                    key={cand.id}
                    className="bg-slate-50 dark:bg-slate-700 rounded-xl p-5 border border-slate-200 dark:border-slate-600 
                             hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {cand.nome}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {cand.vaga}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBackground(score)} ${getScoreColor(score)}`}>
                        {score || 'N/A'}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleVerCurriculo(cand)}
                          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium
                                   bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300
                                   hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Currículo
                        </button>
                        <button
                          onClick={() => handleSelecionarEntrevista(cand)}
                          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium
                                   bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300
                                   hover:bg-slate-200 dark:hover:bg-slate-500 rounded-lg transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          Entrevista
                        </button>
                      </div>

                      <button
                        onClick={() => handleEnviarFichaCadastral(cand)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium
                                 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300
                                 hover:bg-slate-200 dark:hover:bg-slate-500 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Ficha Cadastral
                      </button>

                      <button
                        onClick={() => handleEnviarParaContratacao(cand)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium
                                 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm"
                      >
                        <Briefcase className="w-4 h-4" />
                        Enviar para Contratação
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Agendamento de Entrevista */}
      {interviewModalOpen && selectedCandidateForInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  Agendar Entrevista
                </h3>
                <button
                  onClick={closeInterviewModal}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Fechar modal de agendamento"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Candidato */}
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">Candidato:</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{selectedCandidateForInterview.nome}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCandidateForInterview.vaga}</p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Data */}
                <div>
                  <label htmlFor="interview-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Data da Entrevista
                  </label>
                  <input
                    id="interview-date"
                    type="date"
                    value={interviewData.date}
                    onChange={(e) => setInterviewData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Horário */}
                <div>
                  <label htmlFor="interview-time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Horário
                  </label>
                  <input
                    id="interview-time"
                    type="time"
                    value={interviewData.time}
                    onChange={(e) => setInterviewData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  />
                </div>

                {/* Tipo da Entrevista */}
                <div>
                  <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" id="interview-type-label">
                    Tipo da Entrevista
                  </span>
                  <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="interview-type-label">
                    <button
                      type="button"
                      onClick={() => setInterviewData(prev => ({ ...prev, type: 'online' }))}
                      className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        interviewData.type === 'online'
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                      aria-pressed={interviewData.type === 'online'}
                    >
                      <Monitor className="w-4 h-4" />
                      Online
                    </button>
                    <button
                      type="button"
                      onClick={() => setInterviewData(prev => ({ ...prev, type: 'presencial' }))}
                      className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        interviewData.type === 'presencial'
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                      aria-pressed={interviewData.type === 'presencial'}
                    >
                      <MapPin className="w-4 h-4" />
                      Presencial
                    </button>
                  </div>
                </div>

                {/* Link da Reunião (apenas se online) */}
                {interviewData.type === 'online' && (
                  <div>
                    <label htmlFor="meeting-link" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Link da Reunião
                    </label>
                    <input
                      id="meeting-link"
                      type="url"
                      value={interviewData.meetingLink}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, meetingLink: e.target.value }))}
                      placeholder="https://meet.google.com/..."
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2
                               bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                               focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                )}

                {/* Local (apenas se presencial) */}
                {interviewData.type === 'presencial' && (
                  <div>
                    <label htmlFor="interview-location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Local da Entrevista
                    </label>
                    <input
                      id="interview-location"
                      type="text"
                      value={interviewData.location}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Endereço ou sala..."
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2
                               bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                               focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                  </div>
                )}

                {/* Entrevistador */}
                <div>
                  <label htmlFor="interviewer" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Entrevistador
                  </label>
                  <input
                    id="interviewer"
                    type="text"
                    value={interviewData.interviewer}
                    onChange={(e) => setInterviewData(prev => ({ ...prev, interviewer: e.target.value }))}
                    placeholder="Nome do entrevistador..."
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  />
                </div>

                {/* Observações */}
                <div>
                  <label htmlFor="interview-notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Observações (opcional)
                  </label>
                  <textarea
                    id="interview-notes"
                    value={interviewData.notes}
                    onChange={(e) => setInterviewData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Instruções adicionais..."
                    rows={3}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                             focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeInterviewModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300
                           bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600
                           rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleScheduleInterview}
                  disabled={!interviewData.date || !interviewData.time || !interviewData.interviewer}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium
                           bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed
                           text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Enviar Convite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Currículo */}
      {selectedResume && (
        <ResumeModal
          resume={selectedResume}
          onClose={() => setSelectedResume(null)}
          onPrev={() => null}
          onNext={() => null}
          hasPrev={false}
          hasNext={false}
        />
      )}
    </div>
  );
};

export default CandidateProcessingPage;
