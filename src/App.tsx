import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import CandidateProfilePage from './features/candidate/CandidateProfilePage';
import CandidateRegistrationPage from './features/candidate/CandidateRegistrationPage';
import FormContrato from './features/candidate/contract-form/FormContrato';
import EmployeeProfilePage from './features/employee/EmployeeProfilePage';
import EmployeeProfileViewPage from './features/employee/EmployeeProfileViewPage';
import OffboardingDetailPage from './features/offboarding/OffboardingDetailPage';
import OffboardingIntegrationsPage from './features/offboarding/OffboardingIntegrationsPage';
import OffboardingTemplatesPage from './features/offboarding/OffboardingTemplatesPage';
import CandidateProcessingPage from './features/RH/CandidateProcessingPage';
import ContractSigningPage from './features/RH/ContractSigningPage';
import DashboardRH from './features/RH/DashboardRH';
import IndexPage from './features/RH/IndexPage';
import MonitoringReportsPage from './features/RH/MonitoringReportsPage';
import OffboardingListPage from './features/RH/OffboardingListPage';
import TemplateVagas from './features/RH/TemplateVagas';
import VTVRManagementPage from './features/RH/VTVRManagementPage';
import LayoutCandidato from './layout/candidato/LayoutCandidato';
import LayoutRH from './layout/RH/LayoutRH';
import ProtectedRoute from './routes/ProtectedRoute';

const App: React.FC = () => (
  <Router>
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/form_contrato" element={<FormContrato />} />
        <Route element={<LayoutCandidato />}>
          <Route index element={<IndexPage />} />
          <Route path="perfil" element={<CandidateProfilePage />} />
          <Route path="cadastro" element={<CandidateRegistrationPage />} />
        </Route>
        <Route
          path="/rh"
          element={
            <ProtectedRoute requiredRole="rh">
              <LayoutRH />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardRH />} />
          <Route path="processamento" element={<CandidateProcessingPage />} />
          <Route path="contratacao" element={<ContractSigningPage />} />
          <Route path="funcionarios" element={<EmployeeProfilePage />} />
          <Route path="employee/:id" element={<EmployeeProfileViewPage />} />
          <Route path="pagamentos" element={<VTVRManagementPage />} />
          <Route path="monitoramento" element={<MonitoringReportsPage />} />
          <Route path="templates-vagas" element={<TemplateVagas />} />

          {/* offboarding */}
          <Route path="offboarding" element={<OffboardingListPage />} />
          <Route path="offboarding/:id" element={<OffboardingDetailPage />} />
          <Route path="offboarding/templates" element={<OffboardingTemplatesPage />} />
          <Route path="offboarding/integrations" element={<OffboardingIntegrationsPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  </Router>
);

export default App;
