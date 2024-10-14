import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  return currentUser && isAdmin ? <>{children}</> : <Navigate to="/" />;
};

export default AdminRoute;