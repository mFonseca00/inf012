import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import authService from "../services/authService";
import userService from "../services/userService";

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

  // Função para formatar o usuário com dados do backend
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

  // Ao fazer login: salva token e busca dados do usuário
  const login = async (username, password) => {
    try {
      // 1. Faz login e recebe o token
      const response = await authService.login(username, password);
      const token = response.token;

      // 2. Salva o token no localStorage
      localStorage.setItem("token", token);

      // 3. Busca os dados completos do usuário via /user/me
      const profileData = await userService.getProfile();

      // 4. Formata e salva o usuário no estado
      const userData = formatUser(profileData);
      setUser(userData);

      return userData;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  // Ao inicializar: recupera token e busca dados do usuário
  useEffect(() => {
    const recoveredToken = localStorage.getItem("token");

    if (recoveredToken) {
      const initializeUser = async () => {
        try {
          // Valida se o token ainda é válido
          const decoded = jwtDecode(recoveredToken);
          if (decoded.exp * 1000 > Date.now()) {
            // Busca os dados completos do usuário
            const profileData = await userService.getProfile();
            const userData = formatUser(profileData);
            setUser(userData);
          } else {
            // Token expirado
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Erro ao recuperar usuário:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      };

      initializeUser();
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}