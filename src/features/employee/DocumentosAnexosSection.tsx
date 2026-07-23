import React from 'react';
import { 
  FaFilePdf, FaFileWord, FaTrash, FaUpload, FaFileAlt, 
  FaCalendarAlt, FaFileImage, FaFile, FaPlus, FaTimes, FaSave 
} from 'react-icons/fa';

import {
  Card,
  SectionHeader,
  InputField,
  Button,
  EmptyState,
  designTokens
} from './DesignSystem';

interface Document {
  title: string;
  filename: string;
  date: string;
}

export interface DocumentosAnexosSectionProps {
  documents?: Document[];
  isEditing: boolean;
  showNewAttachment: boolean;
  newAttachmentTitle: string;
  fileInputId: string;
  onToggleNewAttachment: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleChange: (value: string) => void;
  onAddAttachment: () => void;
  onCancelNewAttachment: () => void;
  selectedAttachments: number[];
  toggleAttachmentSelection: (index: number) => void;
  onRemoveSelectedAttachments: () => void;
  onDocumentClick?: (document: Document, index: number) => void;
  onRemoveDocument?: (index: number) => void;
}

const getFileIcon = (filename: string) => {
  const ext = filename.toLowerCase().split('.').pop();
  switch (ext) {
    case 'pdf':
      return {
        icon: <FaFilePdf className="text-2xl" />,
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800'
      };
    case 'doc':
    case 'docx':
      return {
        icon: <FaFileWord className="text-2xl" />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800'
      };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return {
        icon: <FaFileImage className="text-2xl" />,
        color: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800'
      };
    default:
      return {
        icon: <FaFile className="text-2xl" />,
        color: 'text-gray-500',
        bgColor: 'bg-gray-50 dark:bg-gray-800',
        borderColor: 'border-gray-200 dark:border-gray-600'
      };
  }
};

const DocumentCard: React.FC<{
  doc: Document;
  index: number;
  isEditing: boolean;
  selectedAttachments: number[];
  toggleAttachmentSelection: (index: number) => void;
  onDocumentClick?: (document: Document, index: number) => void;
  onRemoveDocument?: (index: number) => void;
}> = ({
  doc,
  index,
  isEditing,
  selectedAttachments,
  toggleAttachmentSelection,
  onDocumentClick,
  onRemoveDocument
}) => {
  const fileInfo = getFileIcon(doc.filename);

  return (
    <div
      className={`
        group relative rounded-xl border p-6 ${designTokens.transitions.normal}
        cursor-pointer hover:shadow-md
        ${fileInfo.bgColor} ${fileInfo.borderColor}
      `}
      role="button"
      tabIndex={0}
      onClick={() => onDocumentClick?.(doc, index)}
      onKeyDown={(e) => e.key === 'Enter' && onDocumentClick?.(doc, index)}
    >
      <div className="flex items-start gap-4">
        {isEditing && (
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={selectedAttachments.includes(index)}
              onChange={() => toggleAttachmentSelection(index)}
              className={`
                h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600
                focus:ring-2 focus:ring-blue-500 ${designTokens.transitions.normal}
                dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600
              `}
            />
          </div>
        )}
        <div className={`flex-shrink-0 ${fileInfo.color}`}>
          {fileInfo.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className={`${designTokens.typography.heading.h5} mb-1 truncate text-gray-900 dark:text-gray-100`}>
            {doc.title}
          </h4>
          <p className="mb-2 truncate text-xs text-gray-500 dark:text-gray-400">
            {doc.filename}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <FaCalendarAlt />
              <span>{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onRemoveDocument?.(index)}
              variant="ghost"
              size="sm"
              icon={<FaTrash />}
            >
              <span className="sr-only">Remover</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const DocumentosAnexosSection: React.FC<DocumentosAnexosSectionProps> = ({
  documents,
  isEditing,
  showNewAttachment,
  newAttachmentTitle,
  fileInputId,
  onToggleNewAttachment,
  onFileChange,
  onTitleChange,
  onAddAttachment,
  onCancelNewAttachment,
  selectedAttachments,
  toggleAttachmentSelection,
  onRemoveSelectedAttachments,
  onDocumentClick,
  onRemoveDocument,
}) => {
  return (
    <Card variant="elevated">
      <SectionHeader
        title="Documentos Anexos"
        subtitle={documents?.length ? `${documents.length} documento(s) anexado(s)` : 'Nenhum documento anexado'}
        icon={<FaFileAlt />}
        badge={documents?.length || 0}
        actions={isEditing && (
          <div className="flex gap-2">
            <Button
              onClick={onToggleNewAttachment}
              variant={showNewAttachment ? 'secondary' : 'primary'}
              size="sm"
              icon={showNewAttachment ? <FaTimes /> : <FaUpload />}
            >
              {showNewAttachment ? 'Cancelar' : 'Adicionar'}
            </Button>
            {selectedAttachments.length > 0 && (
              <Button
                onClick={onRemoveSelectedAttachments}
                variant="danger"
                size="sm"
                icon={<FaTrash />}
              >
                Remover ({selectedAttachments.length})
              </Button>
            )}
          </div>
        )}
      />

      {showNewAttachment && isEditing && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800 dark:bg-blue-900/10">
          <h4 className={`${designTokens.typography.heading.h4} mb-4 text-gray-900 dark:text-gray-100`}>
            Adicionar Novo Documento
          </h4>
          <div className="space-y-4">
            <div>
              <label 
                htmlFor={fileInputId} 
                className={`block ${designTokens.typography.label} mb-2 text-gray-700 dark:text-gray-200`}
              >
                Selecionar Arquivo:
              </label>
              <div className="relative">
                <input
                  id={fileInputId}
                  type="file"
                  onChange={onFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  className={`
                    block w-full cursor-pointer rounded-lg border text-sm
                    ${designTokens.transitions.normal}
                    border-gray-300 bg-white text-gray-900 file:mr-4 
                    file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm
                    file:font-medium file:text-blue-700 hover:file:bg-blue-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100
                    dark:file:bg-blue-900/20 dark:file:text-blue-300 dark:hover:file:bg-blue-900/30
                  `}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Formatos aceitos: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (máx. 10MB)
              </p>
            </div>

            <InputField
              label="Título do Documento"
              value={newAttachmentTitle}
              onChange={onTitleChange}
              placeholder="Ex: Contrato de Trabalho, Certificados, RG, CPF..."
              required
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={onCancelNewAttachment}
              variant="secondary"
              size="sm"
              icon={<FaTimes />}
            >
              Cancelar
            </Button>
            <Button
              onClick={onAddAttachment}
              variant="primary"
              size="sm"
              icon={<FaSave />}
              disabled={!newAttachmentTitle.trim()}
            >
              Salvar Documento
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        {documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {documents.map((doc, index) => (
              <DocumentCard
                key={index}
                doc={doc}
                index={index}
                isEditing={isEditing}
                selectedAttachments={selectedAttachments}
                toggleAttachmentSelection={toggleAttachmentSelection}
                onDocumentClick={onDocumentClick}
                onRemoveDocument={onRemoveDocument}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FaFileAlt />}
            title="Nenhum documento anexado"
            subtitle={
              isEditing 
                ? "Comece adicionando o primeiro documento deste colaborador"
                : "Este colaborador ainda não possui documentos anexados"
            }
            action={isEditing && (
              <Button
                onClick={onToggleNewAttachment}
                variant="primary"
                size="sm"
                icon={<FaPlus />}
              >
                Adicionar primeiro documento
              </Button>
            )}
          />
        )}
      </div>
    </Card>
  );
};

export default DocumentosAnexosSection;
