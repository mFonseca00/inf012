// src/pages/dashboard/index.jsx
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import MainLayout from "../../components/layout/MainLayout"; // Importe o Layout
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const hasRole = (targetRole) => {
    if (!user?.roles) return false;
    return user.roles.includes(targetRole) || user.roles.includes("MASTER");
  };

  return (
    // Envolve tudo no MainLayout
    <MainLayout>
      <div className={styles.dashboardGrid}>
        {hasRole("DOCTOR") && (
          <div className={styles.card}>
            <h2>Área do Médico</h2>
            <p>Ver meus próximos pacientes...</p>
          </div>
        )}

        {hasRole("PATIENT") && (
          <div className={styles.card}>
            <h2>Minhas Consultas</h2>
            <p>Agendar nova consulta...</p>
          </div>
        )}

        {hasRole("ADMIN") && (
          <div className={styles.card}>
            <h2>Painel Administrativo</h2>
            <p>Gerenciar usuários...</p>
          </div>
        )}

        <div className={styles.card}>
          <h2>Bem-vindo ao Sistema</h2>
          <p>Selecione uma opção no menu lateral.</p>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
