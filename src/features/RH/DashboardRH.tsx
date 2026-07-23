import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import React, { useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';

import PageHeader from '../../layout/RH/PageHeader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Hook customizado para Dark Mode
 */
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(() =>
    document.documentElement.classList.contains('dark')
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}

/**
 * Componente ChartCard com design padrão
 */
interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  children,
  action,
  className = '',
}) => {
  return (
    <div
      className={`
      bg-white dark:bg-slate-800 rounded-xl shadow-sm
      border border-slate-200 dark:border-slate-700 
      transition-all duration-300 
      hover:shadow-innova dark:hover:shadow-innova-glow/20 
      ${className}
    `}
    >
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            {description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
            )}
          </div>
          {action}
        </div>
      </div>
      <div className="p-6">
        <div className="h-80">{children}</div>
      </div>
    </div>
  );
};

/**
 * Card de template seguindo padrão das outras páginas
 */
interface TemplateCardProps {
  title: string;
  area: string;
  createdAt: string;
  applications: number;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, area, createdAt, applications }) => {
  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'Tecnologia':
        return <FaIcons.FaLaptopCode className="text-primary-500 dark:text-primary-400" />;
      case 'Design':
        return <FaIcons.FaPalette className="text-purple-500 dark:text-purple-400" />;
      case 'Marketing':
        return <FaIcons.FaBullhorn className="text-orange-500 dark:text-orange-400" />;
      case 'Vendas':
        return <FaIcons.FaChartLine className="text-green-500 dark:text-green-400" />;
      case 'Produto':
        return <FaIcons.FaRocket className="text-blue-500 dark:text-blue-400" />;
      default:
        return <FaIcons.FaBriefcase className="text-slate-500 dark:text-slate-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 hover:shadow-innova dark:hover:shadow-innova-glow/20 hover:border-primary-200 dark:hover:border-primary-700 cursor-pointer group flex-shrink-0 w-72">
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">{getAreaIcon(area)}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm">
            {title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{area}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
              <FaIcons.FaUsers className="w-3 h-3" />
              <span>{applications}</span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">{createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Seção de Templates seguindo padrão das outras páginas
 */
type SavedTemplateDash = {
  id: string;
  nome: string;
  cargo: string;
  area: string;
  data: string;
  conteudoMarkdown: string;
  conteudoLinkedIn: string;
  formulario: any;
};

const TEMPLATES_KEY = 'rh_template_saved_models';

const TemplatesSection: React.FC = () => {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [saved, setSaved] = React.useState<SavedTemplateDash[]>([]);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(false);

  const readSaved = React.useCallback(() => {
    try {
      const raw = localStorage.getItem(TEMPLATES_KEY);
      const parsed = raw ? (JSON.parse(raw) as SavedTemplateDash[]) : [];
      setSaved(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSaved([]);
    }
  }, []);

  const evaluateArrows = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = scrollWidth - clientWidth - 1;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft < maxScrollLeft);
  }, []);

  React.useEffect(() => {
    readSaved();
    const onStorage = (e: StorageEvent) => {
      if (e.key === TEMPLATES_KEY) readSaved();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('resize', evaluateArrows);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('resize', evaluateArrows);
    };
  }, [readSaved, evaluateArrows]);

  React.useEffect(() => {
    requestAnimationFrame(evaluateArrows);
  }, [saved, evaluateArrows]);

  const items = saved.slice(0, 12).map((t) => ({
    title: t.nome || t.cargo || 'Template',
    area: t.area || t.formulario?.area || '—',
    createdAt: t.data ? new Date(t.data).toLocaleDateString('pt-BR') : '',
    applications: Math.floor(Math.random() * 50),
  }));

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const delta = dir === 'left' ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(evaluateArrows, 320);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Templates de Vagas Recentes
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Últimas vagas criadas e suas métricas de performance
            </p>
          </div>

          <Link
            to="/rh/templates-vagas#saved"
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 flex items-center gap-2"
          >
            Ver todos
            <FaIcons.FaChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="relative">
          {/* Botões de navegação */}
          <button
            type="button"
            aria-label="Rolar para a esquerda"
            onClick={() => scrollByAmount('left')}
            className={`hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow hover:scale-105 transition ${
              canLeft ? '' : 'opacity-0 pointer-events-none'
            }`}
          >
            <FaIcons.FaChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>

          <button
            type="button"
            aria-label="Rolar para a direita"
            onClick={() => scrollByAmount('right')}
            className={`hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow hover:scale-105 transition ${
              canRight ? '' : 'opacity-0 pointer-events-none'
            }`}
          >
            <FaIcons.FaChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>

          <div
            ref={trackRef}
            onScroll={evaluateArrows}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          >
            {items.map((template, index) => (
              <div key={index} className="snap-start">
                <TemplateCard {...template} />
              </div>
            ))}

            {/* Estado vazio */}
            {items.length === 0 && (
              <div className="flex items-center justify-center w-full">
                <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center max-w-md">
                  <FaIcons.FaArchive className="mx-auto mb-3 text-2xl text-slate-400 dark:text-slate-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Nenhum modelo salvo ainda. Clique em <strong>Criar Template</strong> para começar
                    ou{' '}
                    <Link
                      to="/rh/templates-vagas#saved"
                      className="text-primary-600 dark:text-primary-400 underline"
                    >
                      ver modelos
                    </Link>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* Card para criar novo template */}
            <Link
              to="/rh/templates-vagas"
              className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex-shrink-0 w-72 flex items-center justify-center group hover:border-primary-400 dark:hover:border-primary-600 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                  <FaIcons.FaPlus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 className="font-medium text-slate-700 dark:text-slate-300 text-sm mb-1">
                  Criar Template
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-500">Nova vaga</p>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardRH: React.FC = () => {
  const isDarkMode = useDarkMode();

  // Estatísticas para o header (seguindo padrão das outras páginas)
  const stats = useMemo(() => {
    return {
      total: 247,
      processos: 23,
      analise: 89,
      score: 8.7,
    };
  }, []);

  // Cores dinâmicas baseadas no tema
  const colors = useMemo(
    () => ({
      text: isDarkMode ? '#F1F5F9' : '#334155',
      textSecondary: isDarkMode ? '#94A3B8' : '#64748B',
      grid: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
      primary: isDarkMode ? '#8A65FF' : '#5E3BFF',
    }),
    [isDarkMode]
  );

  // Dados dos gráficos
  const candidatesByPositionData = {
    labels: ['Desenvolvedor', 'Designer', 'Product Manager', 'Marketing', 'Vendas', 'Outros'],
    datasets: [
      {
        label: 'Candidatos por Cargo',
        data: [45, 23, 18, 15, 12, 8],
        backgroundColor: [
          'rgba(94, 59, 255, 0.8)',
          'rgba(138, 101, 255, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgba(94, 59, 255, 1)',
          'rgba(138, 101, 255, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const aiScoresData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Pontuação Média IA',
        data: [7.2, 7.5, 8.1, 8.3, 8.6, 8.7],
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const conversionFunnelData = {
    labels: ['Candidatura', 'Triagem', '1ª Entrevista', '2ª Entrevista', 'Oferta'],
    datasets: [
      {
        label: 'Taxa de Conversão (%)',
        data: [100, 65, 45, 28, 18],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(94, 59, 255, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.text,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: colors.textSecondary },
        grid: { color: colors.grid },
      },
      y: {
        ticks: { color: colors.textSecondary },
        grid: { color: colors.grid },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: colors.text,
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header Padronizado seguindo padrão das outras páginas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <PageHeader
          title="Dashboard RH"
          subtitle="Análise de candidatos e métricas de recrutamento"
          actions={
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaUsers className="w-4 h-4 text-slate-600 dark:text-slate-400 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {stats.total}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Candidatos</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaBrain className="w-4 h-4 text-primary-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {stats.score}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Score IA</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaClipboardCheck className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {stats.processos}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Processos</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <FaIcons.FaUserClock className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {stats.analise}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Em Análise</div>
              </div>
            </div>
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Gráficos de Análise */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Análises e Relatórios
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Métricas detalhadas dos processos seletivos
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Gráfico: Candidatos por Cargo */}
            <ChartCard title="Candidatos por Cargo" description="Distribuição atual de candidatos por posição">
              <Doughnut data={candidatesByPositionData} options={doughnutOptions} />
            </ChartCard>

            {/* Gráfico: Evolução IA Scores */}
            <ChartCard title="Evolução Pontuação IA" description="Qualidade média dos candidatos ao longo do tempo">
              <Line data={aiScoresData} options={chartOptions} />
            </ChartCard>

            {/* Gráfico: Funil de Conversão */}
            <ChartCard title="Funil de Conversão" description="Taxa de aprovação por etapa do processo">
              <Bar data={conversionFunnelData} options={chartOptions} />
            </ChartCard>
          </div>
        </section>
        
        {/* Templates Recentes */}
        <TemplatesSection />
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DashboardRH;
