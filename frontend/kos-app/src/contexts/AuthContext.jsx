import React, { createContext, useState, useContext } from "react"; // Adicione useContext
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
      return { token: storedToken };
    }
    return null;
  });

  const loading = false; // Veja a nota sobre isso abaixo

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    const userData = {
      username,
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
