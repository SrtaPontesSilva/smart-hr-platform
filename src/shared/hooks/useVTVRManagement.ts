// frontend/src/features/RH/management/hooks/useVTVRManagement.ts
import { useState, useMemo, useCallback } from 'react';

import { Employee, PaymentStatus, StatusFilter, SortField, SortOrder, ToastState } from '../types';

interface UseVTVRManagementProps {
  employees: Employee[];
  setEmployees: (employees: Employee[] | ((prev: Employee[]) => Employee[])) => void;
}

export const useVTVRManagement = ({ employees, setEmployees }: UseVTVRManagementProps) => {
  // Estados de controle da UI
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [loadingActions, setLoadingActions] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

  // Função para mostrar toast
  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }, []);

  // Função para controlar loading de ações
  const setActionLoading = useCallback((id: number, loading: boolean) => {
    setLoadingActions(prev => {
      const newSet = new Set(prev);
      if (loading) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  // Função para ordenação
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField, sortOrder]);

  // Ação de aprovação com feedback
  const handleAprovarPagamento = useCallback(async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja aprovar o pagamento de ${nome}?`)) {
      return;
    }

    setActionLoading(id, true);
    
    // Simula delay de processamento
    setTimeout(() => {
      setEmployees(prev =>
        prev.map(emp => (emp.id === id ? { ...emp, statusPagamento: 'Aprovado' as PaymentStatus } : emp))
      );
      setActionLoading(id, false);
      showToast(`Pagamento de ${nome} aprovado com sucesso!`, 'success');
    }, 1000);
  }, [setEmployees, setActionLoading, showToast]);

  // Ação de efetivação com feedback
  const handleEfetuarPagamento = useCallback(async (id: number, nome: string) => {
    if (!window.confirm(`Confirma a efetivação do pagamento de ${nome}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setActionLoading(id, true);
    
    // Simula delay de processamento
    setTimeout(() => {
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === id ? { 
            ...emp, 
            statusPagamento: 'Pago' as PaymentStatus, 
            dataPagamento: new Date().toISOString() 
          } : emp
        )
      );
      setActionLoading(id, false);
      showToast(`Pagamento de ${nome} efetuado com sucesso!`, 'success');
    }, 1500);
  }, [setEmployees, setActionLoading, showToast]);

  // Funcionários filtrados e ordenados (memoizado para performance)
  const funcionariosFiltrados = useMemo(() => {
    let filtered = employees;

    // Aplicar filtro por status
    if (statusFilter !== 'Todos') {
      filtered = filtered.filter(emp => emp.statusPagamento === statusFilter);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'nome':
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        case 'vencimento':
          aValue = new Date(a.vencimento);
          bValue = new Date(b.vencimento);
          break;
        case 'salario':
          aValue = a.salario;
          bValue = b.salario;
          break;
        case 'statusPagamento':
          aValue = a.statusPagamento;
          bValue = b.statusPagamento;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, statusFilter, sortField, sortOrder]);

  // Estatísticas dos dados
  const stats = useMemo(() => {
    const total = employees.length;
    const pendentes = employees.filter(emp => emp.statusPagamento === 'Pendente').length;
    const aprovados = employees.filter(emp => emp.statusPagamento === 'Aprovado').length;
    const pagos = employees.filter(emp => emp.statusPagamento === 'Pago').length;
    const vencidos = employees.filter(emp => 
      new Date(emp.vencimento) < new Date() && emp.statusPagamento !== 'Pago'
    ).length;
    
    const totalSalarios = employees.reduce((sum, emp) => sum + emp.salario, 0);
    const totalVT = employees.reduce((sum, emp) => sum + emp.vtTotal, 0);
    const totalVR = employees.reduce((sum, emp) => sum + emp.vrTotal, 0);
    const totalGeral = totalSalarios + totalVT + totalVR;

    return {
      total,
      pendentes,
      aprovados,
      pagos,
      vencidos,
      totalSalarios,
      totalVT,
      totalVR,
      totalGeral
    };
  }, [employees]);

  return {
    // Estados
    statusFilter,
    setStatusFilter,
    sortField,
    sortOrder,
    loadingActions,
    toast,
    setToast,
    
    // Dados processados
    funcionariosFiltrados,
    stats,
    
    // Funções
    showToast,
    handleSort,
    handleAprovarPagamento,
    handleEfetuarPagamento,
    setActionLoading,
  };
};

// Hook para gerenciar exportações
export const useExportData = (employees: Employee[]) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = useCallback(async (filteredEmployees?: Employee[]) => {
    setIsExporting(true);
    try {
      // Aqui você integraria com SheetJS ou outra biblioteca
      const data = filteredEmployees || employees;
      
      // Simula processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Exportando para Excel:', data);
      alert(`Exportação Excel concluída! ${data.length} registros exportados.`);
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      alert('Erro ao exportar para Excel. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  }, [employees]);

  const exportToPDF = useCallback(async (filteredEmployees?: Employee[]) => {
    setIsExporting(true);
    try {
      // Aqui você integraria com jsPDF ou outra biblioteca
      const data = filteredEmployees || employees;
      
      // Simula processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Exportando para PDF:', data);
      alert(`Exportação PDF concluída! ${data.length} registros exportados.`);
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
      alert('Erro ao exportar para PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  }, [employees]);

  return {
    isExporting,
    exportToExcel,
    exportToPDF
  };
};

// Hook para validações
export const useEmployeeValidation = () => {
  const validateEmployee = useCallback((employee: Partial<Employee>): string[] => {
    const errors: string[] = [];

    if (!employee.nome?.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!employee.salario || employee.salario <= 0) {
      errors.push('Salário deve ser maior que zero');
    }

    if (!employee.vencimento) {
      errors.push('Data de vencimento é obrigatória');
    }

    if (!employee.tipo) {
      errors.push('Tipo de pagamento é obrigatório');
    }

    return errors;
  }, []);

  const isEmployeeValid = useCallback((employee: Partial<Employee>): boolean => {
    return validateEmployee(employee).length === 0;
  }, [validateEmployee]);

  return {
    validateEmployee,
    isEmployeeValid
  };
};