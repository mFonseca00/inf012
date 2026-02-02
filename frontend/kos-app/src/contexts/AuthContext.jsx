import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"; // Importação adicionada
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

  // Ao fazer login
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      const token = response.token;

      // [CHECKLIST]: Remover localStorage e usar Cookie simples
      // expires: 1 define que o cookie expira em 1 dia (ajuste conforme necessário)
      Cookies.set("token", token, { expires: 1 });

      const profileData = await userService.getProfile();
      const userData = formatUser(profileData);
      setUser(userData);

      return userData;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  // Ao inicializar
  useEffect(() => {
    // [CHECKLIST]: Leitura do cookie em vez do localStorage
    const recoveredToken = Cookies.get("token");

    if (recoveredToken) {
      const initializeUser = async () => {
        try {
          const decoded = jwtDecode(recoveredToken);
          if (decoded.exp * 1000 > Date.now()) {
            const profileData = await userService.getProfile();
            const userData = formatUser(profileData);
            setUser(userData);
          } else {
            // Token expirado
            Cookies.remove("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Erro ao recuperar usuário:", error);
          Cookies.remove("token");
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      initializeUser();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    // [CHECKLIST]: Remoção do cookie
    Cookies.remove("token");
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
