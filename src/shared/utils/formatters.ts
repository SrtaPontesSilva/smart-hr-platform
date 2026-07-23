// frontend/src/features/RH/management/utils/formatters.ts

/**
 * Formata valor monetário no padrão brasileiro (R$)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formata data no padrão brasileiro (dd/mm/aaaa)
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(date);
};

/**
 * Formata data e hora no padrão brasileiro (dd/mm/aaaa HH:mm)
 */
export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(date);
};

/**
 * Formata número com separadores de milhares
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Formata porcentagem no padrão brasileiro
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Calcula total pago (salário + vtTotal + vrTotal)
 */
export const calcTotalPago = (emp: { salario: number; vtTotal: number; vrTotal: number }): number => {
  return emp.salario + emp.vtTotal + emp.vrTotal;
};

/**
 * Verifica se uma data está vencida
 */
export const isDateOverdue = (dateStr: string): boolean => {
  return new Date(dateStr) < new Date();
};

/**
 * Calcula diferença em dias entre duas datas
 */
export const getDaysDifference = (dateStr1: string, dateStr2: string = new Date().toISOString()): number => {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Obtém status da data com base no vencimento
 */
export const getDateStatus = (vencimento: string): 'vencido' | 'vence_hoje' | 'normal' => {
  const hoje = new Date();
  const dataVencimento = new Date(vencimento);
  
  hoje.setHours(0, 0, 0, 0);
  dataVencimento.setHours(0, 0, 0, 0);
  
  if (dataVencimento < hoje) {
    return 'vencido';
  } else if (dataVencimento.getTime() === hoje.getTime()) {
    return 'vence_hoje';
  } else {
    return 'normal';
  }
};