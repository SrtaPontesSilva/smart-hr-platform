// frontend/src/config/chartConfig.ts
import { ChartOptions, ChartData } from 'chart.js';

export type TotalFuncionariosChartData = ChartData<'line'>
export type TotalFuncionariosChartOptions = ChartOptions<'line'>

export type FuncionariosPorCargoChartData = ChartData<'bar'>
export type FuncionariosPorCargoChartOptions = ChartOptions<'bar'>

export const totalFuncionariosChartData: TotalFuncionariosChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Total de Funcionários',
      data: [100, 105, 110, 120, 125, 130],
      fill: false,
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      tension: 0.2,
    },
  ],
};

export const totalFuncionariosChartOptions = (
  textColor: string,
  gridColor: string
): TotalFuncionariosChartOptions => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: textColor,
      },
    },
    title: {
      display: true,
      text: 'Total de Funcionários (2025)',
      color: textColor,
    },
  },
  scales: {
    x: {
      ticks: { color: textColor },
      grid: { color: gridColor },
    },
    y: {
      beginAtZero: true,
      ticks: { color: textColor },
      grid: { color: gridColor },
    },
  },
});

export const funcionariosPorCargoChartData: FuncionariosPorCargoChartData = {
  labels: ['Dev Back-end', 'Dev Front-end', 'Analista RH', 'Financeiro', 'Marketing'],
  datasets: [
    {
      label: 'Funcionários',
      data: [20, 30, 10, 8, 12],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

export const funcionariosPorCargoChartOptions = (
  textColor: string,
  gridColor: string
): FuncionariosPorCargoChartOptions => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: textColor,
      },
    },
    title: {
      display: true,
      text: 'Funcionários por Cargo',
      color: textColor,
    },
  },
  scales: {
    x: {
      ticks: { color: textColor },
      grid: { color: gridColor },
    },
    y: {
      beginAtZero: true,
      ticks: { color: textColor },
      grid: { color: gridColor },
    },
  },
});
