import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import authService from "../services/authService";
import userService from "../services/userService";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBestRole = (roles) => {
    if (!roles || roles.length === 0) return "USER";
    if (roles.includes("MASTER")) return "MASTER";
    if (roles.includes("ADMIN")) return "ADMIN";
    if (roles.includes("DOCTOR")) return "DOCTOR";
    if (roles.includes("RECEPTIONIST")) return "RECEPTIONIST";
    if (roles.includes("PATIENT")) return "PATIENT";
    return roles[0];
  };

  const formatUser = (profileData) => {
    return {
      userId: profileData.userId,
      username: profileData.username,
      email: profileData.email,
      roles: profileData.roles || [],
      mainRole: getBestRole(profileData.roles),
      patientId: profileData.patientId,
      doctorId: profileData.doctorId,
    };
  };

  const login = async (username, password) => {
    try {
      await authService.login(username, password);

      const profileData = await userService.getProfile();

      const userData = formatUser(profileData);
      setUser(userData);

      return userData;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  useEffect(() => {
    const recoverSession = async () => {
      try {
        const response = await api.get("/auth/session");

        // Se der certo, restaura o usuário no estado
        setUser(response.data);
      } catch (error) {
        // Se der erro (401), significa que o cookie expirou ou não existe
        setUser(null);
      } finally {
        // Terminou a verificação, libera a tela
        setLoading(false);
      }
    };

    recoverSession();
  }, []);

  if (loading) {
    return <div>Carregando sistema...</div>;
  }

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao tentar deslogar no servidor", error);
      // Mesmo se der erro no servidor, limpamos o estado local abaixo
    } finally {
      setUser(null);

      // navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
