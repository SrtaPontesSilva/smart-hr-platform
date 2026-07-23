
import React from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  requiredRole: 'candidato' | 'rh';
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole: _requiredRole, children }) => {
  // Recupera o papel do usuário do localStorage (deve ser salvo em algum momento, por exemplo, no login)
  const _storedRole = localStorage.getItem('user_role');

  // // Se o papel do usuário não existir ou não corresponder, redireciona para o login
  // if (!_storedRole || _storedRole !== _requiredRole) {
  //   return <Navigate to="/login" />;
  // }

  // Se houver children, renderiza-os; caso contrário, renderiza o Outlet para as rotas aninhadas
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
