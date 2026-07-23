import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaUser,
  FaMapMarkerAlt,
  FaFileAlt,
  FaComments,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaPaperPlane,
  FaPowerOff, // novo ícone do botão Desligar
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import useLocalStorage from '../../shared/hooks/useLocalStorage';
import { updateNestedValue } from '../../shared/utils/updateNestedValue';

import DadosPessoaisSection from './DadosPessoaisSection';
import { Button, designTokens } from './DesignSystem';
import DocumentosAnexosSection from './DocumentosAnexosSection';
import { EmployeeFull } from './EmployeeProfilePage';
import GraficoObservacoesSection from './GraficoObservacoesSection';
import { InformacoesComplementaresSection } from './InformacoesComplementaresSection';
import {
  OffboardingRecord,
  NoticeType,
  TerminationType,
  defaultChecklist,
  getOffboardingForEmployee,
  upsertOffboarding,
} from './offboarding';

interface EmployeeDocument {
  title: string;
  filename: string;
  date: string;
}

interface Observacao {
  id: number;
  data: string;
  texto: string;
  tags?: string[];
}

const EmployeeProfileViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Carrega lista geral para encontrar o funcionário pelo ID
  const [employees, setEmployees] = useLocalStorage<EmployeeFull[]>('employees_full', []);
  const selected = useMemo(() => employees.find((e) => e.id === Number(id)), [employees, id]);

  // Estado local editável (mantém rascunho como no modal)
  const [employeeData, setEmployeeData] = useState<EmployeeFull | null>(selected || null);
  const [isEditing, setIsEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Documentos/observações helpers
  const [selectedAttachments, setSelectedAttachments] = useState<number[]>([]);
  const [showNewAttachment, setShowNewAttachment] = useState(false);
  const [newAttachmentTitle, setNewAttachmentTitle] = useState('');
  const [newAttachmentFile, setNewAttachmentFile] = useState<File | null>(null);

  const [showNewObservation, setShowNewObservation] = useState(false);
  const [newObservationText, setNewObservationText] = useState('');
  const [newObservationTags, setNewObservationTags] = useState<string[]>([]);
  const [previewDocument, setPreviewDocument] = useState<EmployeeDocument | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('');

  // ===== Offboarding UI state
  const [showOffModal, setShowOffModal] = useState(false);
  const [offLastWorkDay, setOffLastWorkDay] = useState<string>('');
  const [offTerminationType, setOffTerminationType] = useState<TerminationType>('pedido');
  const [offNoticeType, setOffNoticeType] = useState<NoticeType>('trabalhado');
  const [offReason, setOffReason] = useState<string>('');
  const [offNotes, setOffNotes] = useState<string>('');

  const offInProgress = useMemo(() => {
    if (!employeeData) return undefined;
    return getOffboardingForEmployee(employeeData.id);
  }, [employeeData]);

  useEffect(() => {
    if (!selected) return;
    setEmployeeData(selected);
    setLastSaved(new Date());
  }, [selected]);

  // Autosave de rascunho a cada 5s
  useEffect(() => {
    if (!employeeData || !dirty || !isEditing) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(`draft_employee_${employeeData.id}`, JSON.stringify(employeeData));
      setLastSaved(new Date());
      toast.success('Rascunho salvo automaticamente', { duration: 1200, icon: '💾' });
    }, 5000);
    return () => clearTimeout(timeout);
  }, [employeeData, dirty, isEditing]);

  const updateField = useCallback((field: keyof EmployeeFull, value: any) => {
    setEmployeeData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setDirty(true);
  }, []);

  // Uploads
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [newAttachmentTitle],
  );

  const handleAddAttachment = useCallback(() => {
    if (!employeeData || !newAttachmentFile || !newAttachmentTitle.trim()) {
      toast.error('Selecione arquivo e informe título.');
      return;
    }
    setEmployeeData((prev) =>
      prev
        ? {
            ...prev,
            documentosAnexos: [
              ...(prev.documentosAnexos ?? []),
              { title: newAttachmentTitle.trim(), filename: newAttachmentFile.name, date: new Date().toISOString().slice(0, 10) },
            ],
          }
        : prev,
    );
    setNewAttachmentTitle('');
    setNewAttachmentFile(null);
    setShowNewAttachment(false);
    setDirty(true);
    toast.success('Documento salvo com sucesso!', { icon: '📎' });
  }, [employeeData, newAttachmentFile, newAttachmentTitle]);

  const toggleAttachmentSelection = useCallback((i: number) => {
    setSelectedAttachments((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }, []);

  const handleRemoveSelectedAttachments = useCallback(() => {
    if (!employeeData || !selectedAttachments.length) return;
    if (!confirm(`Tem certeza de que deseja remover ${selectedAttachments.length} documento(s)?`)) return;
    setEmployeeData((prev) =>
      prev
        ? {
            ...prev,
            documentosAnexos: prev.documentosAnexos?.filter((_, idx) => !selectedAttachments.includes(idx)),
          }
        : prev,
    );
    setSelectedAttachments([]);
    setDirty(true);
    toast.success('Documentos removidos!');
  }, [employeeData, selectedAttachments]);

  const handleRemoveDocument = useCallback(
    (index: number) => {
      if (!employeeData) return;
      if (!confirm('Tem certeza de que deseja remover este documento?')) return;
      setEmployeeData((prev) =>
        prev
          ? {
              ...prev,
              documentosAnexos: prev.documentosAnexos?.filter((_, i) => i !== index),
            }
          : prev,
      );
      setDirty(true);
      toast.success('Documento removido!');
    },
    [employeeData],
  );

  const handleAddObservation = useCallback(() => {
    if (!employeeData) return;
    if (!newObservationText.trim()) {
      toast.error('Digite algo antes de salvar.');
      return;
    }

    // alias para cumprir object-shorthand sem erro de escopo
    const tags = newObservationTags;

    const novaObs: Observacao = {
      id: Date.now(),
      data: new Date().toISOString().slice(0, 10),
      texto: newObservationText.trim(),
      tags,
    };

    setEmployeeData((prev) =>
      prev ? { ...prev, observacoesDetalhadas: [...(prev.observacoesDetalhadas ?? []), novaObs] } : prev,
    );

    // Salvar no localStorage
    const storageKey = `innova-observations-employee-${employeeData.id}`;
    const existingObservations = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedObservations = [...existingObservations, novaObs];
    localStorage.setItem(storageKey, JSON.stringify(updatedObservations));

    // Salvar tags no localStorage global
    if (newObservationTags.length > 0) {
      const tagsStorageKey = 'innova-observation-tags';
      const existingTags = JSON.parse(localStorage.getItem(tagsStorageKey) || '[]');
      const updatedTags = Array.from(new Set([...existingTags, ...newObservationTags]));
      localStorage.setItem(tagsStorageKey, JSON.stringify(updatedTags));
    }

    setNewObservationText('');
    setNewObservationTags([]);
    setShowNewObservation(false);
    setDirty(true);
    toast.success('Observação adicionada!', { icon: '📝' });
  }, [employeeData, newObservationText, newObservationTags]);

  const handleAddObservationWithTags = useCallback((tags: string[]) => {
    if (!employeeData) return;
    if (!newObservationText.trim()) {
      toast.error('Digite algo antes de salvar.');
      return;
    }
    const novaObs: Observacao = {
      id: Date.now(),
      data: new Date().toISOString().slice(0, 10),
      texto: newObservationText.trim(),
      tags, // shorthand correto aqui
    };
    setEmployeeData((prev) =>
      prev ? { ...prev, observacoesDetalhadas: [...(prev.observacoesDetalhadas ?? []), novaObs] } : prev,
    );

    // Salvar no localStorage
    const storageKey = `innova-observations-employee-${employeeData.id}`;
    const existingObservations = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedObservations = [...existingObservations, novaObs];
    localStorage.setItem(storageKey, JSON.stringify(updatedObservations));

    // Salvar tags no localStorage global
    if (tags.length > 0) {
      const tagsStorageKey = 'innova-observation-tags';
      const existingTags = JSON.parse(localStorage.getItem(tagsStorageKey) || '[]');
      const updatedTags = Array.from(new Set([...existingTags, ...tags]));
      localStorage.setItem(tagsStorageKey, JSON.stringify(updatedTags));
    }

    setNewObservationText('');
    setNewObservationTags([]);
    setShowNewObservation(false);
    setDirty(true);
    toast.success('Observação adicionada!', { icon: '📝' });
  }, [employeeData, newObservationText]);

  const handleUpdateObservationTags = useCallback((observationId: number, tags: string[]) => {
    if (!employeeData) return;

    setEmployeeData((prev) => {
      if (!prev) return prev;

      const updatedObservations = (prev.observacoesDetalhadas ?? []).map((obs) =>
        obs.id === observationId ? { ...obs, tags } : obs,
      );

      return { ...prev, observacoesDetalhadas: updatedObservations };
    });

    // Atualizar no localStorage
    const storageKey = `innova-observations-employee-${employeeData.id}`;
    const existingObservations = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedObservations = existingObservations.map((obs: Observacao) =>
      obs.id === observationId ? { ...obs, tags } : obs,
    );
    localStorage.setItem(storageKey, JSON.stringify(updatedObservations));

    // Salvar tags no localStorage global
    if (tags.length > 0) {
      const tagsStorageKey = 'innova-observation-tags';
      const existingTags = JSON.parse(localStorage.getItem(tagsStorageKey) || '[]');
      const updatedTags = Array.from(new Set([...existingTags, ...tags]));
      localStorage.setItem(tagsStorageKey, JSON.stringify(updatedTags));
    }

    setDirty(true);
  }, [employeeData]);

  const chartData = useMemo(
    () => ({
      labels: ['Raiva', 'Felicidade', 'Tristeza', 'Medo', 'Nojo'],
      datasets: [
        {
          data: [
            employeeData?.iaData?.raiva || 0,
            employeeData?.iaData?.felicidade || 0,
            employeeData?.iaData?.tristeza || 0,
            employeeData?.iaData?.medo || 0,
            employeeData?.iaData?.nojo || 0,
          ],
          backgroundColor: ['#EF4444', '#10B981', '#22C1FF', '#6B7280', '#5E3BFF'],
          borderColor: ['#DC2626', '#059669', '#0EA5E9', '#4B5563', '#4338CA'],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    }),
    [employeeData],
  );

  const chartOptions = useMemo(
    () => ({
      plugins: {
        legend: { labels: { color: 'inherit', font: { size: 14 } } },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#5E3BFF',
          borderWidth: 1,
        },
      },
      maintainAspectRatio: false,
    }),
    [],
  );

  const [activeTabId, setActiveTabId] = useState('dados-pessoais');
  const [tabTransition, setTabTransition] = useState(false);
  const navigateToTab = useCallback(
    (tabId: string) => {
      if (tabId === activeTabId) return;
      setTabTransition(true);
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setActiveTabId(tabId);
        setTabTransition(false);
      }, 150);
    },
    [activeTabId],
  );

  const tabs = useMemo(
    () => [
      {
        id: 'dados-pessoais',
        label: 'Dados Pessoais',
        icon: <FaUser />,
        component: (
          <DadosPessoaisSection
            employeeData={employeeData as EmployeeFull}
            isEditing={isEditing}
            updateField={updateField}
          />
        ),
        hasChanges: dirty,
      },
      {
        id: 'informacoes-complementares',
        label: 'Informações Complementares',
        icon: <FaMapMarkerAlt />,
        component: (
          <InformacoesComplementaresSection
            employeeData={employeeData as EmployeeFull}
            isEditing={isEditing}
            updateField={updateField}
            updateNested={(path: (string | number)[], value: any) => {
              setEmployeeData((prev) => (prev ? updateNestedValue(prev, path, value) : prev));
              setDirty(true);
            }}
          />
        ),
      },
      {
        id: 'documentos-anexos',
        label: 'Documentos',
        icon: <FaFileAlt />,
        component: (
          <DocumentosAnexosSection
            documents={employeeData?.documentosAnexos}
            isEditing={isEditing}
            showNewAttachment={showNewAttachment}
            newAttachmentTitle={newAttachmentTitle}
            fileInputId="newAttachmentFileInput"
            onToggleNewAttachment={() => setShowNewAttachment((v) => !v)}
            onFileChange={handleFileChange}
            onTitleChange={setNewAttachmentTitle}
            onAddAttachment={handleAddAttachment}
            onCancelNewAttachment={() => {
              setShowNewAttachment(false);
              setNewAttachmentTitle('');
              setNewAttachmentFile(null);
            }}
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
        label: 'Feedback & Observações',
        icon: <FaComments />,
        component: (
          <GraficoObservacoesSection
            chartData={chartData}
            chartOptions={chartOptions}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            filteredObservations={employeeData?.observacoesDetalhadas || []}
            showNewObservation={showNewObservation}
            newObservationText={newObservationText}
            newObservationInputId="newObservationText"
            setShowNewObservation={setShowNewObservation}
            setNewObservationText={setNewObservationText}
            handleAddObservation={handleAddObservation}
            newObservationTags={newObservationTags}
            setNewObservationTags={setNewObservationTags}
            handleAddObservationWithTags={handleAddObservationWithTags}
            onUpdateObservationTags={handleUpdateObservationTags}
          />
        ),
      },
    ],
    [
      employeeData,
      isEditing,
      dirty,
      showNewAttachment,
      newAttachmentTitle,
      selectedAttachments,
      showNewObservation,
      newObservationText,
      newObservationTags,
      chartData,
      chartOptions,
      dateFilter,
      updateField,
      handleFileChange,
      handleAddAttachment,
      toggleAttachmentSelection,
      handleRemoveSelectedAttachments,
      handleRemoveDocument,
      handleAddObservation,
      handleAddObservationWithTags,
      handleUpdateObservationTags,
    ],
  );

  const activeTab = tabs.find((t) => t.id === activeTabId);

  const handleSave = useCallback(async () => {
    if (!employeeData) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setEmployees((prev) => prev.map((e) => (e.id === employeeData.id ? employeeData : e)));
    localStorage.removeItem(`draft_employee_${employeeData.id}`);
    setDirty(false);
    setIsSaving(false);
    setIsEditing(false);
    toast.success('Alterações salvas com sucesso!', { icon: '✅' });
  }, [employeeData, setEmployees]);

  // === Criar registro de desligamento
  const handleCreateOffboarding = useCallback(() => {
    if (!employeeData) return;
    if (!offLastWorkDay) {
      toast.error('Informe o último dia de trabalho.');
      return;
    }
    const rec: OffboardingRecord = {
      id: Date.now(),
      employeeId: employeeData.id,
      status: 'em_andamento',
      checklist: defaultChecklist,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastWorkDay: offLastWorkDay,
      terminationType: offTerminationType,
      noticeType: offNoticeType,
      reasonCode: offReason,
      notes: offNotes,
    };
    upsertOffboarding(rec);
    setShowOffModal(false);
    toast.success('Desligamento criado!', { icon: '🧾' });
  }, [employeeData, offLastWorkDay, offTerminationType, offNoticeType, offReason, offNotes]);

  if (!employeeData) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-700 dark:text-gray-200">Colaborador não encontrado.</p>
          <div className="mt-6">
            <Button onClick={() => navigate(-1)} variant="secondary" size="md" icon={<FaArrowLeft />}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-6">
      {/* Header sticky com tabs */}
      <div className="sticky top-0 z-20 -mx-3 mb-4 border-b border-gray-200 bg-white/90 px-3 py-3 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate(-1)} variant="secondary" size="sm" icon={<FaArrowLeft />}>
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {employeeData.nome}
                {offInProgress && (
                  <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                    Desligamento agendado
                  </span>
                )}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {employeeData.cargo || 'Cargo não informado'} • ID: {employeeData.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEmployeeData(selected || employeeData);
                    setDirty(false);
                  }}
                  variant="secondary"
                  size="sm"
                  icon={<FaTimes />}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  variant="success"
                  size="sm"
                  icon={isSaving ? <FaSpinner /> : <FaCheck />}
                  disabled={isSaving}
                  loading={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </>
            ) : (
              <>
                {dirty && (
                  <div className="mr-2 hidden items-center gap-2 text-orange-600 dark:text-orange-400 sm:flex">
                    <FaExclamationTriangle className="text-sm" />
                    <span className="text-xs">Alterações não salvas</span>
                  </div>
                )}
                <Button onClick={() => setIsEditing(true)} variant="primary" size="sm" icon={<FaEdit />}>
                  Editar Perfil
                </Button>
                <Button
                  onClick={() => toast.success('E-mail institucional gerado!', { icon: '📧' })}
                  variant="primary"
                  size="sm"
                  icon={<FaPaperPlane />}
                >
                  Gerar E-mail
                </Button>
                <Button
                  onClick={() => setShowOffModal(true)}
                  variant="danger"
                  size="sm"
                  icon={<FaPowerOff />}
                >
                  Desligar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Nav de seções */}
        <nav className="mt-3 flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigateToTab(tab.id)}
              className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${designTokens.transitions.normal} ${
                activeTabId === tab.id
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400'
              }`}
              role="tab"
              aria-selected={activeTabId === tab.id}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.hasChanges && isEditing && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo */}
      <div
        ref={scrollContainerRef}
        className={`${tabTransition ? 'opacity-50' : 'opacity-100'} ${designTokens.transitions.normal}`}
      >
        {activeTab?.component}
      </div>

      {/* Pré-visualização de documentos (abre na mesma página) */}
      {previewDocument && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4">
          <div className="relative h-[85vh] w-full max-w-5xl rounded-xl bg-white p-4 shadow-xl dark:bg-gray-900">
            <button
              onClick={() => setPreviewDocument(null)}
              className="absolute right-4 top-4 rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FaTimes />
            </button>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {previewDocument.title}
            </h3>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Arquivo: {previewDocument.filename}
            </p>
            <iframe
              src={previewDocument.filename}
              title={previewDocument.title}
              className="h-[75vh] w-full rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      )}

      {/* Barra de status */}
      <div className="mt-6 flex items-center justify-between px-1 text-xs text-gray-500 dark:text-gray-400">
        {isEditing && (
          <span className={`flex items-center gap-1 ${dirty ? 'text-orange-600' : 'text-green-600'}`}>
            <span className={`h-2 w-2 rounded-full ${dirty ? 'bg-orange-500' : 'bg-green-500'}`} />
            {dirty ? 'Não salvo' : 'Salvo'}
          </span>
        )}
        {lastSaved && (
          <span>
            Último rascunho:{' '}
            {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Modal de Offboarding (Desligamento) */}
      {showOffModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Criar desligamento</h3>
              <button
                onClick={() => setShowOffModal(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Fechar modal de desligamento"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm">
                Último dia de trabalho
                <input
                  type="date"
                  className="mt-1 w-full input-base"
                  value={offLastWorkDay}
                  onChange={(e) => setOffLastWorkDay(e.target.value)}
                />
              </label>

              <label className="block text-sm">
                Tipo de desligamento
                <select
                  className="mt-1 w-full input-base"
                  value={offTerminationType}
                  onChange={(e) => setOffTerminationType(e.target.value as TerminationType)}
                >
                  <option value="pedido">Pedido de demissão</option>
                  <option value="sem_justa_causa">Sem justa causa</option>
                  <option value="término">Término de contrato</option>
                  <option value="acordo">Acordo</option>
                  <option value="outra">Outra</option>
                </select>
              </label>

              <label className="block text-sm">
                Aviso prévio
                <select
                  className="mt-1 w-full input-base"
                  value={offNoticeType}
                  onChange={(e) => setOffNoticeType(e.target.value as NoticeType)}
                >
                  <option value="trabalhado">Trabalhado</option>
                  <option value="indenizado">Indenizado</option>
                  <option value="nao_aplica">Não se aplica</option>
                </select>
              </label>

              <label className="block text-sm">
                Motivo (código)
                <input
                  className="mt-1 w-full input-base"
                  placeholder="ex.: performance, ajuste de quadro..."
                  value={offReason}
                  onChange={(e) => setOffReason(e.target.value)}
                />
              </label>

              <label className="block text-sm">
                Observações
                <textarea
                  className="mt-1 w-full input-base"
                  rows={3}
                  value={offNotes}
                  onChange={(e) => setOffNotes(e.target.value)}
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowOffModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateOffboarding}>
                Criar desligamento
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfileViewPage;
