import React, { ReactNode } from "react";
import { useAuth } from "../context/\bauth-context";
import Login from "../routes/auth/login";
import { Outlet } from "react-router-dom";

const AuthWrapper = () => {
  const { token } = useAuth();

  if (!token) {
    return <Login />;
  }

  return <Outlet />;
};

export default AuthWrapper;
