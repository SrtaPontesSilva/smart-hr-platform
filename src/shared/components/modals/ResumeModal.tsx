import React, { useState, useMemo } from 'react';
import {
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaDownload,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaFileAlt,
  FaUserCircle,
  FaUniversity,
  FaBuilding,
  FaHeart,
  FaEye,
  FaFilePdf,
} from 'react-icons/fa';

import { Resume } from '../../../shared/types/resume';

interface ResumeModalProps {
  resume: Resume;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

// Simulação de dados do perfil - em produção, isso viria de uma API
const getMockProfileData = (resume: Resume) => {
  // Aqui você buscaria os dados reais do perfil baseado no resume.id
  return {
    name: resume.candidateName,
    email: `${resume.candidateName.toLowerCase().replace(/\s/g, '.')}@email.com`,
    phone: '(61) 99999-9999',
    jobTitle: resume.vacancy,
    jobSummary:
      'Profissional dedicado com experiência sólida na área de tecnologia. Busco oportunidades para contribuir com meu conhecimento e crescer profissionalmente em um ambiente colaborativo.',
    avatarUrl: null,
    skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git'],
    experiences: [
      {
        role: 'Desenvolvedor Frontend',
        company: 'Tech Solutions Ltda',
        startDate: 'Jan 2022',
        endDate: 'Atual',
        description:
          'Desenvolvimento de aplicações web responsivas utilizando React e TypeScript. Colaboração com equipes multidisciplinares para entrega de projetos de alta qualidade.',
      },
      {
        role: 'Desenvolvedor Junior',
        company: 'StartupXYZ',
        startDate: 'Mar 2021',
        endDate: 'Dez 2021',
        description:
          'Desenvolvimento de features frontend e backend. Participação ativa em code reviews e implementação de melhores práticas de desenvolvimento.',
      },
    ],
    formation: [
      {
        degree: 'Bacharelado em Ciência da Computação',
        institution: 'Universidade de Brasília',
        graduationDate: '12/2020',
        description: 'Formação completa com foco em desenvolvimento de software e algoritmos.',
      },
      {
        degree: 'Curso Técnico em Informática',
        institution: 'Instituto Federal de Brasília',
        graduationDate: '12/2017',
        description: 'Base sólida em programação e sistemas.',
      },
    ],
    documents: [
      { fileName: 'curriculo.pdf', fileUrl: resume.fileUrl, isPdf: true, isMain: true },
      { fileName: 'diploma.pdf', fileUrl: '/docs/diploma.pdf', isPdf: true, isMain: false },
    ],
  };
};

const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children: React.ReactNode;
}> = ({ title, subtitle, icon, badge, children }) => (
  <div className="rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="rounded-lg bg-primary-500/10 p-2 text-primary-500">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            {badge && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
    </div>
    <div className="px-6 py-4">{children}</div>
  </div>
);

const ExperienceItem: React.FC<{ experience: any }> = ({ experience }) => (
  <div className="border-l-4 border-primary-500 py-3 pl-4 rounded-r-lg bg-primary-500/5">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
      <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-base">{experience.role}</h4>
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
        {`${experience.startDate} - ${experience.endDate}`}
      </span>
    </div>
    {experience.company && (
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
        <FaBuilding className="h-3 w-3" />
        <span>{experience.company}</span>
      </div>
    )}
    {experience.description && (
      <p className="text-sm text-slate-700 dark:text-slate-300">{experience.description}</p>
    )}
  </div>
);

const FormationItem: React.FC<{ formation: any }> = ({ formation }) => (
  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{formation.degree}</h4>
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
        {formation.graduationDate}
      </span>
    </div>
    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <FaUniversity className="h-3 w-3" />
      <span>{formation.institution}</span>
    </div>
    {formation.description && (
      <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{formation.description}</p>
    )}
  </div>
);

const SkillsDisplay: React.FC<{ skills: string[] }> = ({ skills }) => (
  <div className="flex flex-wrap gap-2">
    {skills.map((skill, index) => (
      <span
        key={index}
        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20"
      >
        {skill}
      </span>
    ))}
  </div>
);

const DocumentCard: React.FC<{ document: any }> = ({ document }) => (
  <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
        <FaFilePdf className="h-5 w-5 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{document.fileName}</p>
        {document.isMain && (
          <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">Currículo principal</span>
        )}
      </div>
    </div>
    <a
      href={document.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 text-slate-500 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
      title="Visualizar documento"
    >
      <FaEye className="h-4 w-4" />
    </a>
  </div>
);

const ResumeModal: React.FC<ResumeModalProps> = ({
  resume,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  const [viewMode, setViewMode] = useState<'profile' | 'document'>('profile');

  const profileData = useMemo(() => getMockProfileData(resume), [resume]);

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-6xl h-[90vh] transform rounded-xl bg-slate-50 dark:bg-slate-900 bg-opacity-100 shadow-2xl transition-all duration-300">
        {/* Cabeçalho do modal */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                {profileData.avatarUrl ? (
                  <img src={profileData.avatarUrl} alt={profileData.name} className="h-full w-full object-cover" />
                ) : (
                  <FaUserCircle className="h-full w-full text-slate-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {profileData.name}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {profileData.jobTitle} • {resume.age} anos
                </p>
              </div>
            </div>

            {/* Toggle de visualização */}
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('profile')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'profile'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Perfil
              </button>
              <button
                onClick={() => setViewMode('document')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'document'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Documento
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Corpo do modal */}
        <div className="h-[calc(90vh-8rem)] overflow-auto p-6">
          {viewMode === 'profile' ? (
            <div className="space-y-6">
              {/* Banner com informações básicas */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur overflow-hidden">
                    {profileData.avatarUrl ? (
                      <img src={profileData.avatarUrl} alt={profileData.name} className="h-full w-full object-cover" />
                    ) : (
                      <FaUserCircle className="h-full w-full text-white/70" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{profileData.name}</h1>
                    <p className="text-white/90 font-medium">{profileData.jobTitle}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/80">
                      <span className="flex items-center gap-1">
                        <FaEnvelope className="h-3 w-3" />
                        {profileData.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaPhone className="h-3 w-3" />
                        {formatPhone(profileData.phone)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sobre Mim */}
              <SectionCard title="Sobre Mim" icon={<FaHeart />}>
                <p className="text-slate-700 dark:text-slate-300">{profileData.jobSummary}</p>
              </SectionCard>

              {/* Experiências */}
              <SectionCard
                title="Experiências Profissionais"
                subtitle={`${profileData.experiences.length} experiência(s) registrada(s)`}
                icon={<FaBriefcase />}
                badge={profileData.experiences.length}
              >
                <div className="space-y-4">
                  {profileData.experiences.map((exp, index) => (
                    <ExperienceItem key={index} experience={exp} />
                  ))}
                </div>
              </SectionCard>

              {/* Formação */}
              <SectionCard
                title="Formação Acadêmica"
                subtitle={`${profileData.formation.length} formação(ões) registrada(s)`}
                icon={<FaGraduationCap />}
                badge={profileData.formation.length}
              >
                <div className="space-y-4">
                  {profileData.formation.map((form, index) => (
                    <FormationItem key={index} formation={form} />
                  ))}
                </div>
              </SectionCard>

              {/* Habilidades */}
              <SectionCard
                title="Habilidades"
                subtitle={`${profileData.skills.length} habilidade(s) registrada(s)`}
                icon={<FaTools />}
                badge={profileData.skills.length}
              >
                <SkillsDisplay skills={profileData.skills} />
              </SectionCard>

              {/* Documentos */}
              <SectionCard
                title="Documentos Anexados"
                subtitle={`${profileData.documents.length} documento(s) disponível(is)`}
                icon={<FaFileAlt />}
                badge={profileData.documents.length}
              >
                <div className="space-y-3">
                  {profileData.documents.map((doc, index) => (
                    <DocumentCard key={index} document={doc} />
                  ))}
                </div>
              </SectionCard>
            </div>
          ) : (
            /* Visualização do documento original */
            <div className="h-full">
              {resume.fileType === 'pdf' ? (
                <iframe
                  src={resume.fileUrl}
                  title={resume.candidateName}
                  className="h-full w-full rounded-lg border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-600 dark:text-slate-400">
                  <div className="text-center">
                    <FaFileAlt className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                    <p className="text-lg">Visualização para arquivos DOC não suportada.</p>
                    <p className="text-sm mt-2">Use o botão de download para acessar o arquivo.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé do modal */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 rounded-b-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="rounded-lg bg-slate-100 dark:bg-slate-700 p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Candidato anterior"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="rounded-lg bg-slate-100 dark:bg-slate-700 p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Próximo candidato"
            >
              <FaArrowRight className="text-lg" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Submetido em {new Date(resume.submissionDate).toLocaleDateString('pt-BR')}
            </span>
            <a
              href={resume.fileUrl}
              download
              className="flex items-center gap-2 rounded-lg bg-green-500 hover:bg-green-600 px-4 py-2 text-white transition shadow-sm"
              title="Baixar currículo original"
            >
              <FaDownload />
              <span>Download Original</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
