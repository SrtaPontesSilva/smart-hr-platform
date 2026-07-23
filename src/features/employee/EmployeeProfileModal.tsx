// src/features/employee/EmployeeProfileModal.tsx

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import React, { useState, useEffect, useMemo, useCallback, ChangeEvent, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  FaPaperPlane,
  FaEdit,
  FaCheck,
  FaUser,
  FaMapMarkerAlt,
  FaFileAlt,
  FaComments,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';

import ConfirmModal from '../../shared/components/modals/ConfirmModal';
import Modal from '../../shared/components/modals/Modal';
import useLocalStorage from '../../shared/hooks/useLocalStorage';
import { updateNestedValue } from '../../shared/utils/updateNestedValue';

import DadosPessoaisSection from './DadosPessoaisSection';
import {
  Button,
  LoadingSpinner,
  designTokens
} from './DesignSystem';
import DocumentosAnexosSection from './DocumentosAnexosSection';
import { EmployeeFull } from './EmployeeProfilePage';
import GraficoObservacoesSection from './GraficoObservacoesSection';
import { InformacoesComplementaresSection } from './InformacoesComplementaresSection';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EmployeeProfileModalProps {
  employee: EmployeeFull;
  onClose: () => void;
  onSave: (updatedEmployee: EmployeeFull) => void;
}

interface Document {
  title: string;
  filename: string;
  date: string;
}

interface StatusBarProps {
  isEditing: boolean;
  dirty: boolean;
  lastSaved: Date | null;
}

const StatusBar: React.FC<StatusBarProps> = ({ isEditing, dirty, lastSaved }) => (
  <div className="flex items-center justify-between px-2 text-xs text-gray-500 dark:text-gray-400">
    <div className="flex items-center gap-4">
      {isEditing && (
        <>
          <span className={`flex items-center gap-1 ${dirty ? 'text-orange-600' : 'text-green-600'}`}>
            <div className={`h-2 w-2 rounded-full ${dirty ? 'bg-orange-500' : 'bg-green-500'}`} />
            {dirty ? 'Não salvo' : 'Salvo'}
          </span>
          {lastSaved && (
            <span>
              Último rascunho: {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </>
      )}
    </div>
    <div className="flex items-center gap-2">
      <span>Ctrl+← / Ctrl+→ para navegar</span>
      {isEditing && <span>• Ctrl+S para salvar</span>}
    </div>
  </div>
);

const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({ employee, onClose, onSave }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [employeeData, setEmployeeData] = useLocalStorage<EmployeeFull>(
    `employeeProfileModal_${employee.id}`,
    employee
  );
  const [isEditing, setIsEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [selectedAttachments, setSelectedAttachments] = useState<number[]>([]);
  const [showNewAttachment, setShowNewAttachment] = useState(false);
  const [newAttachmentTitle, setNewAttachmentTitle] = useState('');
  const [newAttachmentFile, setNewAttachmentFile] = useState<File | null>(null);
  const [showNewObservation, setShowNewObservation] = useState(false);
  const [newObservationText, setNewObservationText] = useState('');
  const [confirmConfig, setConfirmConfig] = useState<{
    message: string;
    onConfirm: () => void;
    type?: 'warning' | 'danger' | 'info';
  } | null>(null);

  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('');

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setEmployeeData(employee);
    setLastSaved(new Date());
  }, [employee, setEmployeeData]);

  useEffect(() => {
    if (dirty && isEditing) {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      const timeout = setTimeout(() => {
        localStorage.setItem(
          `draft_employee_${employee.id}`,
          JSON.stringify(employeeData)
        );
        setLastSaved(new Date());
        toast.success('Rascunho salvo automaticamente', { duration: 2000, icon: '💾' });
      }, 5000);
      setAutoSaveTimeout(timeout);
      return () => clearTimeout(timeout);
    }
  }, [employeeData, dirty, isEditing, employee.id]);

  const chartData = useMemo(() => ({
    labels: ['Raiva', 'Felicidade', 'Tristeza', 'Medo', 'Nojo'],
    datasets: [{
      data: [
        employeeData.iaData.raiva,
        employeeData.iaData.felicidade,
        employeeData.iaData.tristeza,
        employeeData.iaData.medo,
        employeeData.iaData.nojo,
      ],
      backgroundColor: ['#F87171', '#FBBF24', '#60A5FA', '#9CA3AF', '#A78BFA'],
      hoverOffset: 6,
    }],
  }), [employeeData.iaData]);

  const chartOptions = useMemo<ChartOptions<'doughnut'>>(() => ({
    plugins: {
      legend: {
        labels: {
          color: 'inherit',
          font: { size: 14 },
        },
      },
    },
  }), []);

  const handleFieldChange = useCallback((field: keyof EmployeeFull, value: any) => {
    setEmployeeData((prev: EmployeeFull) => ({ ...prev, [field]: value }));
    setDirty(true);
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  }, [setEmployeeData, validationErrors]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo permitido: 10MB');
      return;
    }
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'];
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowed.includes(ext)) {
      toast.error('Tipo de arquivo não permitido.');
      return;
    }
    setNewAttachmentFile(file);
    if (!newAttachmentTitle.trim()) {
      setNewAttachmentTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  }, [newAttachmentTitle]);

  const handleAddAttachment = useCallback(() => {
    if (!newAttachmentFile || !newAttachmentTitle.trim()) {
      toast.error('Selecione arquivo e informe título.');
      return;
    }
    setEmployeeData((prev: EmployeeFull) => ({
      ...prev,
      documentosAnexos: [
        ...(prev.documentosAnexos ?? []),
        {
          title: newAttachmentTitle.trim(),
          filename: newAttachmentFile.name,
          date: new Date().toISOString().slice(0, 10),
        }
      ],
    }));
    setNewAttachmentTitle('');
    setNewAttachmentFile(null);
    setShowNewAttachment(false);
    setDirty(true);
    toast.success('Documento salvo com sucesso!', { icon: '📎' });
  }, [newAttachmentFile, newAttachmentTitle, setEmployeeData]);

  const toggleAttachmentSelection = useCallback((i: number) => {
    setSelectedAttachments(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  }, []);

  const handleRemoveSelectedAttachments = useCallback(() => {
    if (!selectedAttachments.length) return;
    setConfirmConfig({
      message: `Tem certeza de que deseja remover ${selectedAttachments.length} documento(s) selecionado(s)?`,
      type: 'danger',
      onConfirm: () => {
        setEmployeeData((prev: EmployeeFull) => ({
          ...prev,
          documentosAnexos: prev.documentosAnexos?.filter((_, idx) => !selectedAttachments.includes(idx)),
        }));
        setSelectedAttachments([]);
        setDirty(true);
        toast.success('Documentos removidos!');
        setConfirmConfig(null);
      }
    });
  }, [selectedAttachments, setEmployeeData]);

  const handleRemoveDocument = useCallback((index: number) => {
    setConfirmConfig({
      message: 'Tem certeza de que deseja remover este documento?',
      type: 'danger',
      onConfirm: () => {
        setEmployeeData((prev: EmployeeFull) => ({
          ...prev,
          documentosAnexos: prev.documentosAnexos?.filter((_, i) => i !== index),
        }));
        setDirty(true);
        toast.success('Documento removido!');
        setConfirmConfig(null);
      }
    });
  }, [setEmployeeData]);

  const handleAddObservation = useCallback(() => {
    if (!newObservationText.trim()) {
      toast.error('Digite algo antes de salvar.');
      return;
    }
    const novaObs = {
      id: Date.now(),
      data: new Date().toISOString().slice(0, 10),
      texto: newObservationText.trim(),
    };
    setEmployeeData((prev: EmployeeFull) => ({
      ...prev,
      observacoesDetalhadas: [...prev.observacoesDetalhadas, novaObs]
    }));
    setNewObservationText('');
    setShowNewObservation(false);
    setDirty(true);
    toast.success('Observação adicionada!', { icon: '📝' });
  }, [newObservationText, setEmployeeData]);

  const tabs = useMemo(() => [
    {
      id: 'dados-pessoais',
      label: 'Dados Pessoais',
      icon: <FaUser />, component: (
        <DadosPessoaisSection
          employeeData={employeeData}
          isEditing={isEditing}
          updateField={handleFieldChange}
        />
      ), hasChanges: dirty,
    },
    {
      id: 'informacoes-complementares',
      label: 'Informações Complementares',
      icon: <FaMapMarkerAlt />, component: (
        <InformacoesComplementaresSection
          employeeData={employeeData}
          isEditing={isEditing}
          updateField={handleFieldChange}
          updateNested={(path: (string | number)[], value: any) => {
            setEmployeeData((prev: EmployeeFull) => updateNestedValue(prev, path, value));
            setDirty(true);
          }}
        />
      ),
    },
    {
      id: 'documentos-anexos',
      label: 'Documentos', icon: <FaFileAlt />, component: (
        <DocumentosAnexosSection
          documents={employeeData.documentosAnexos}
          isEditing={isEditing}
          showNewAttachment={showNewAttachment}
          newAttachmentTitle={newAttachmentTitle}
          fileInputId="newAttachmentFileInput"
          onToggleNewAttachment={() => setShowNewAttachment(v => !v)}
          onFileChange={handleFileChange}
          onTitleChange={setNewAttachmentTitle}
          onAddAttachment={handleAddAttachment}
          onCancelNewAttachment={() => { setShowNewAttachment(false); setNewAttachmentTitle(''); setNewAttachmentFile(null); }}
          selectedAttachments={selectedAttachments}
          toggleAttachmentSelection={toggleAttachmentSelection}
          onRemoveSelectedAttachments={handleRemoveSelectedAttachments}
          onDocumentClick={(doc) => setPreviewDocument({ ...doc })}
          onRemoveDocument={handleRemoveDocument}
        />
      ),
    },
    {
      id: 'feedback-observacoes',
      label: 'Feedback & Observações', icon: <FaComments />, component: (
        <GraficoObservacoesSection
          chartData={chartData}
          chartOptions={chartOptions}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          filteredObservations={employeeData.observacoesDetalhadas}
          showNewObservation={showNewObservation}
          newObservationText={newObservationText}
          newObservationInputId="newObservationText"
          setShowNewObservation={setShowNewObservation}
          setNewObservationText={setNewObservationText}
          handleAddObservation={handleAddObservation}
        />
      ),
    },
  ], [employeeData, isEditing, dirty, showNewAttachment, newAttachmentTitle, selectedAttachments, showNewObservation, newObservationText, chartData, chartOptions, dateFilter, handleFieldChange, handleFileChange, handleAddAttachment, toggleAttachmentSelection, handleRemoveSelectedAttachments, handleRemoveDocument, handleAddObservation]);

  const [activeTabId, setActiveTabId] = useState('dados-pessoais');
  const [tabTransition, setTabTransition] = useState(false);

  const navigateToTab = useCallback((tabId: string) => {
    if (tabId === activeTabId) return;
    setTabTransition(true);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { setActiveTabId(tabId); setTabTransition(false); }, 150);
  }, [activeTabId]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const idx = tabs.findIndex(t => t.id === activeTabId);
        if (e.key === 'ArrowLeft' && idx > 0) {
          e.preventDefault(); navigateToTab(tabs[idx-1].id);
        }
        if (e.key === 'ArrowRight' && idx < tabs.length-1) {
          e.preventDefault(); navigateToTab(tabs[idx+1].id);
        }
        if (e.key === 's' && isEditing && dirty) {
          e.preventDefault(); handleToggleEdit();
        }
        if (e.key === 'Escape' && isEditing) {
          e.preventDefault(); handleCancelEdit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTabId, tabs, isEditing, dirty, navigateToTab]);

  const handleClose = useCallback(() => {
    if (dirty) {
      setConfirmConfig({
        message: 'Você possui alterações não salvas. Deseja realmente fechar sem salvar?',
        type: 'warning',
        onConfirm: () => { localStorage.removeItem(`draft_employee_${employee.id}`); setConfirmConfig(null); onClose(); }
      });
      return;
    }
    onClose();
  }, [dirty, onClose, employee.id]);

  const handleToggleEdit = useCallback(async () => {
    if (!isEditing) { setIsEditing(true); return; }
    if (dirty) {
      setIsSaving(true);
      try {
        await new Promise(res => setTimeout(res, 1000));
        onSave(employeeData);
        localStorage.removeItem(`draft_employee_${employee.id}`);
        toast.success('Alterações salvas com sucesso!', { icon: '✅', duration: 3000 });
        setDirty(false); setIsEditing(false); setSelectedAttachments([]); setLastSaved(new Date());
      } catch {
        toast.error('Erro ao salvar alterações. Tente novamente.');
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(false);
    }
  }, [isEditing, dirty, onSave, employeeData, employee.id]);

  const handleCancelEdit = useCallback(() => {
    if (dirty) {
      setConfirmConfig({
        message: 'Todas as alterações não salvas serão perdidas. Deseja continuar?',
        type: 'warning',
        onConfirm: () => {
          setEmployeeData(employee); setDirty(false); setIsEditing(false); setSelectedAttachments([]); setValidationErrors({}); localStorage.removeItem(`draft_employee_${employee.id}`); toast('Alterações descartadas', { icon: '⚠️' }); setConfirmConfig(null);
        }
      });
    } else {
      setIsEditing(false);
    }
  }, [dirty, employee, setEmployeeData]);

  const footerActions = (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        {isSaving && (
          <div className="flex(items-center gap-2 text-blue-600 dark:text-blue-400)"><LoadingSpinner size="sm" /><span className="text-sm">Salvando...</span></div>
        )}
        {dirty && !isSaving && (
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400"><FaExclamationTriangle className="text-sm" /><span className="text-sm">Alterações não salvas</span></div>
        )}
      </div>
      <div className="flex gap-3">
        {isEditing ? (<><Button onClick={handleCancelEdit} variant="secondary" size="sm" icon={<FaTimes />} disabled={isSaving}>Cancelar</Button><Button onClick={handleToggleEdit} variant="success" size="sm" icon={isSaving ? <FaSpinner /> : <FaCheck />} disabled={isSaving} loading={isSaving}>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</Button></>) : (<Button onClick={handleToggleEdit} variant="primary" size="sm" icon={<FaEdit />}>Editar Perfil</Button>)}
      </div>
    </div>
  );

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <>
      <Modal title={employeeData.nome} subtitle={`${employeeData.cargo || 'Cargo não informado'} • ID: ${employeeData.id}`} isOpen onClose={handleClose} footerActions={footerActions} className="max-h-[95vh] max-w-7xl" icon={<FaUser />}>
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 px-6 pt-6 dark:border-gray-700">
            <nav className="mb-4 flex(space-x-1)">{tabs.map(tab => (<button key={tab.id} onClick={() => navigateToTab(tab.id)} className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${designTokens.transitions.normal} relative ${activeTabId === tab.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400'}`} role="tab" aria-selected={activeTabId === tab.id}><span className="text-base">{tab.icon}</span><span>{tab.label}</span>{tab.hasChanges && isEditing && <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-orange-500" />}</button>))}</nav>
          </div>
          <div ref={scrollContainerRef} className={`${tabTransition ? 'opacity-50' : 'opacity-100'} flex-1 overflow-y-auto p-6 ${designTokens.transitions.normal}`}>{activeTab?.component}</div>
          <div className="border-t border-gray-200 px-6 py-2 dark:border-gray-700"><StatusBar isEditing={isEditing} dirty={dirty} lastSaved={lastSaved} /></div>
        </div>
        <div className="absolute bottom-20 right-6"><Button onClick={() => toast.success('E-mail institucional gerado!', { icon: '📧' })} variant="primary" size="lg" icon={<FaPaperPlane />}>Gerar E-mail</Button></div>
      </Modal>
      {previewDocument && (<Modal title={previewDocument.title} subtitle={`Arquivo: ${previewDocument.filename}`} isOpen onClose={() => setPreviewDocument(null)} icon={<FaFileAlt />}><div className="p-6"><iframe src={previewDocument.filename} title={previewDocument.title} className="h-[70vh] w-full rounded-lg border border-gray-200 dark:border-gray-600"/></div></Modal>)}
      {confirmConfig && (<ConfirmModal isOpen message={confirmConfig.message} type={confirmConfig.type} onConfirm={confirmConfig.onConfirm} onCancel={() => setConfirmConfig(null)} confirmText="Confirmar" cancelText="Cancelar"/>)}
    </>
  );
};

export default EmployeeProfileModal;
