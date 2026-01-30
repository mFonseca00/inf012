import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Importe a biblioteca
import authService from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBestRole = (roles) => {
    if (!roles || roles.length === 0) return "USER";

    // Verifica na ordem de importância
    if (roles.includes("MASTER")) return "MASTER";
    if (roles.includes("ADMIN")) return "ADMIN";
    if (roles.includes("DOCTOR")) return "DOCTOR";
    if (roles.includes("RECEPTIONIST")) return "RECEPTIONIST";
    if (roles.includes("PATIENT")) return "PATIENT";

    // Se não achar nenhuma especial, retorna a primeira ou USER
    return roles[0];
  };

  // Função auxiliar para decodificar o token e formatar o usuário
  const processToken = (token, rolesExternas) => {
    try {
      const decoded = jwtDecode(token);
      let finalRoles = rolesExternas;

      if (!finalRoles) {
        const storedRoles = localStorage.getItem("user_roles");
        if (storedRoles) {
          finalRoles = JSON.parse(storedRoles);
        } else {
          finalRoles = decoded.roles || [];
        }
      }
      // O Spring Boot geralmente coloca o usuário no campo 'sub'
      // e as roles em 'roles', 'authorities' ou 'scope' dependendo da config
      return {
        username: decoded.sub,
        // Adapte abaixo conforme seu token (pode ser decoded.roles[0] se for array)
        roles: finalRoles,
        mainRole: getBestRole(finalRoles),
        exp: decoded.exp,
      };
    } catch (error) {
      console.error("Token inválido", error);
      return null;
    }
  };

  useEffect(() => {
    const recoveredToken = localStorage.getItem("token");

    if (recoveredToken) {
      const userData = processToken(recoveredToken);
      // Verifica se o token não expirou (opcional, mas recomendado)
      if (userData && userData.exp * 1000 > Date.now()) {
        setUser(userData);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user_roles");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // 1. Chama a API
    const response = await authService.login(username, password);

    // 2. Pega o token da resposta (ajuste se vier como response.token ou apenas response)
    const token = response.token;
    const backendRoles = response.roles;

    // 3. Salva no LocalStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user_roles", JSON.stringify(backendRoles));

    // 4. Decodifica e atualiza o estado IMEDIATAMENTE
    const userData = processToken(token, backendRoles);
    setUser(userData);

    // Não precisa de navigate aqui, o Login.jsx já faz isso após o await login()
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_roles");
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
