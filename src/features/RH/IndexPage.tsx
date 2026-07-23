import React from 'react';
import { Link } from 'react-router-dom';

import useLocalStorage from '../../shared/hooks/useLocalStorage';

const CandidateHomePage: React.FC = () => {
  // Usamos apenas setActions, por isso ignoramos a variável de estado com prefixo _
  const [_actions, setActions] = useLocalStorage<string[]>('candidateHomePageActions', []);

  const logAction = (desc: string) => {
    const now = new Date().toISOString();
    setActions(prev => {
      const updated = [...prev, `${desc} em ${now}`];
      return updated.length > 100 ? updated.slice(-100) : updated;
    });
  };

  const handleDownloadCurriculo = () => logAction('Currículo baixado');
  const handleEnviarCurriculo = () => logAction('Acesso ao envio de currículo');

  return (
    <div className="candidate-theme flex w-full flex-col items-center">
      {/* Banner institucional */}
      <section className="flex w-full flex-col items-center innova-gradient px-4 py-10 text-white">
        <h1 className="mb-4 text-4xl font-bold">Bem-vindo à Nossa Empresa</h1>
        <p className="max-w-2xl text-center text-lg">
          Somos referência em gestão integrada de candidatos e funcionários. Nosso sistema automatiza processos de
          contratação e centraliza informações, garantindo eficiência e transparência.
        </p>
      </section>

      {/* Seção de Conteúdo */}
      <section className="my-10 flex w-full flex-col items-center px-4">
        {/* Imagem ilustrativa */}
        <img
          src="/assets/empresa-banner.jpg"
          alt="Banner Institucional"
          className="mb-8 w-full max-w-4xl rounded shadow"
        />

        {/* Ações */}
        <div className="flex flex-col items-center gap-4">
          <a
            href="/arquivos/CurriculoPadrao.pdf"
            download
            onClick={handleDownloadCurriculo}
            className="btn-innova btn-innova-primary"
          >
            Baixar Currículo Padrão
          </a>

          <Link
            to="/cadastro"
            onClick={handleEnviarCurriculo}
            className="btn-innova btn-innova-secondary"
          >
            Enviar Currículo e Dados de Admissão
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CandidateHomePage;
