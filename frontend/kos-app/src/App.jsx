import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/auth/Register";
import AppointmentList from "./pages/appointment/AppointmentList";

import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
function App() {
  return (
    <Routes>
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
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
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
        path="/minhas-consultas"
        element={
          <PrivateRoute>
            <AppointmentList />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
