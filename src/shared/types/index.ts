// frontend/src/features/RH/management/types/index.ts

export interface Employee {
  id: number;
  nome: string;
  tipo: PaymentType;
  vencimento: string; // data no formato ISO
  quantia: number;
  dataPagamento: string | null; // se não pago, permanece null
  salario: number;
  vtUnitario: number;
  vrUnitario: number;
  vtTotal: number;
  vrTotal: number;
  statusPagamento: PaymentStatus;
  historicoExcel: string; // URL para download do histórico em Excel
}

export type PaymentType = 'boleto' | 'PIX' | 'direto';

export type PaymentStatus = 'Pendente' | 'Aprovado' | 'Pago';

export type StatusFilter = 'Todos' | PaymentStatus;

export type SortField = 'nome' | 'vencimento' | 'salario' | 'statusPagamento';

export type SortOrder = 'asc' | 'desc';

export interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface FilterConfig {
  status: StatusFilter;
  searchTerm?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  responsive?: boolean; // se a coluna deve ser ocultada em mobile
  render?: (employee: Employee) => React.ReactNode;
}

export interface ActionConfig {
  loading: Set<number>;
  setLoading: (id: number, loading: boolean) => void;
}

export interface ExportOptions {
  format: 'excel' | 'pdf';
  filtered?: boolean; // se deve exportar apenas os dados filtrados
  columns?: string[]; // colunas específicas para exportar
}

// Constantes
export const PAYMENT_TYPES: Record<PaymentType, string> = {
  boleto: 'Boleto',
  PIX: 'PIX',
  direto: 'Direto'
};

export const PAYMENT_STATUS: Record<PaymentStatus, string> = {
  Pendente: 'Pendente',
  Aprovado: 'Aprovado',
  Pago: 'Pago'
};

export const STATUS_COLORS: Record<PaymentStatus, string> = {
  Pendente: 'text-warning bg-warning/10 border-warning/20',
  Aprovado: 'text-primary bg-primary/10 border-primary/20',
  Pago: 'text-success bg-success/10 border-success/20'
};

// Utilitários de tipo
export type RequiredEmployee = Required<Employee>;

export type EmployeeUpdate = Partial<Pick<Employee, 'statusPagamento' | 'dataPagamento'>>;

export type EmployeeCreate = Omit<Employee, 'id' | 'dataPagamento'>;

// Interface para props de componentes
export interface TableProps {
  employees: Employee[];
  loading?: boolean;
  onSort?: (field: SortField) => void;
  onStatusChange?: (id: number, status: PaymentStatus) => void;
  sortConfig?: SortConfig;
}

export interface FilterProps {
  currentFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  totalCount: number;
  filteredCount: number;
}

export interface ActionButtonProps {
  employee: Employee;
  onAction: (id: number, name: string) => void;
  loading: boolean;
  disabled?: boolean;
}