import React from 'react';
import { FaFilePdf, FaFileWord } from 'react-icons/fa';

import { Resume } from  '../../types/resume';

interface ResumeCardProps {
  resume: Resume;
  onClick: () => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="transform cursor-pointer rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
    >
      {/* Área de pré-visualização */}
      <div className="mb-4 flex h-40 items-center justify-center border-b border-gray-200 dark:border-gray-700">
        {resume.fileType === 'pdf' ? (
          <FaFilePdf className="text-6xl text-red-600" />
        ) : (
          <FaFileWord className="text-6xl text-blue-600" />
        )}
      </div>
      {/* Rodapé com informações */}
      <div className="px-4 pb-4 text-sm">
        <p className="text-lg font-bold">{resume.candidateName}</p>
        <p>Idade: <span className="font-medium">{resume.age}</span></p>
        <p>Enviado: <span className="font-medium">{new Date(resume.submissionDate).toLocaleDateString()}</span></p>
        <p>Vaga: <span className="font-medium">{resume.vacancy}</span></p>
      </div>
    </div>
  );
};

export default ResumeCard;
