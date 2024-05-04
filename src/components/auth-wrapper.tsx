import React from 'react';
import { useAuth } from '../context/\bauth-context';
import Login from '../routes/auth/login';
import { Outlet } from 'react-router-dom';

const AuthWrapper = () => {
  const { accessToken } = useAuth();
  if (!accessToken) {
    return <Login />;
  }

  return <Outlet />;
};

export default AuthWrapper;
