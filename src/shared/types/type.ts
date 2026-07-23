// frontend/src/shared/types/type.ts

// Definições de tipos (pode ser num arquivo types.ts, por exemplo)
export interface EmployeeSummary {
  id: number;
  nome: string;
  cargo: string;
  telefone: string;
  pontuacaoIA: number;
  curriculo: string;
  observacoesResumo: string; // Apenas um breve resumo ou string concatenada de observações
}

export interface EmployeeFull extends EmployeeSummary {
  email: string;
  dataAdmissao: string;
  salario: number;
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
  };
  valoresVT: number;
  valoresVR: number;
  contratoPdf: string;
  documentosPessoais: string[];
  observacoes: { id: number; data: string; texto: string }[];
  palavrasChave: string[];
}
