import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";
import MainLayout from "./components/layout/MainLayout";

// Páginas públicas
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Páginas/Componentes privados (conteúdo da área central)
import Dashboard from "./pages/dashboard/Dashboard";
import MonitoringPage from "./pages/dashboard/MonitoringPage";
import AppointmentList from "./pages/appointment/AppointmentList";
import DoctorList from "./pages/usersScreen/DoctorList";

function App() {
  return (
    <Routes>
      {/* ============ ROTAS PÚBLICAS ============ */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* ============ ROTAS PRIVADAS COM LAYOUT PERSISTENTE ============ */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Dashboard - apenas para ADMIN */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Monitoring Dashboard */}
        <Route path="/monitoring" element={<MonitoringPage />} />

        {/* Agendamentos - para PATIENT, DOCTOR, RECEPTIONIST */}
        <Route path="/appointments" element={<AppointmentList />} />

        {/* Gerenciamento de Médicos */}
        <Route path="/doctors" element={<DoctorList />} />

        {/* Redireciona qualquer outra rota privada para dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;