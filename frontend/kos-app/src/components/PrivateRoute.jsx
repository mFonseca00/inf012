import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}
