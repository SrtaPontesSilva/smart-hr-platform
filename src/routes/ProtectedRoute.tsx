
import React from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  requiredRole: 'candidato' | 'rh';
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole: _requiredRole, children }) => {
  // Recupera o papel do usuário do localStorage (deve ser salvo em algum momento, por exemplo, no login)
  const _storedRole = localStorage.getItem('user_role');
  
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
