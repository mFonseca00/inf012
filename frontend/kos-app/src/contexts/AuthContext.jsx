import React, { createContext, useState, useContext } from "react"; // Adicione useContext
import { jwtDecode } from "jwt-decode";
import authService from "../services/authService";

// 1. Crie o Contexto mas NÃO o exporte
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ... (todo o seu código do AuthProvider continua igual aqui) ...
  // Apenas uma observação sobre o loading (veja abaixo nas melhorias)
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      return JSON.parse(storedUser);
    }
    // Cuidado aqui: retornar um objeto diferente pode causar bugs se
    // sua UI espera user.username e recebe apenas user.token
    if (storedToken) {
      try {
        // Tenta decodificar o token salvo ao abrir o site
        const decoded = jwtDecode(storedToken);

        // Verifica se o token não expirou (opcional, mas recomendado)
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          return null;
        }

        // O Spring Boot geralmente coloca o usuário no campo 'sub'
        return {
          username: decoded.sub,
          token: storedToken,
        };
      } catch (error) {
        // Se o token estiver inválido/corrompido
        localStorage.removeItem("token");
        return null;
      }
    }
    return null;
  });

  const loading = false; // Veja a nota sobre isso abaixo

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    const decoded = jwtDecode(data.token);

    const userData = {
      username: decoded.sub, // 'sub' é o padrão JWT para o "Subject" (Dono do token)
      token: data.token,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const register = async (formData) => {
    await authService.register(formData);
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, login, logout, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 2. Exporte um hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
