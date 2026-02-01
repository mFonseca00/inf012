import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // Aguarda o carregamento antes de decidir
  if (loading) {
    return null; // ou um componente de loading
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}
