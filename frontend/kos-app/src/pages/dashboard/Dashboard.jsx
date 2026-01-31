import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/ui/button/Button";
import { toast } from "react-toastify";
import styles from "./Dashboard.module.css";
import AppointmentList from "../appointment/AppointmentList";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const hasRole = (targetRole) => {
    if (!user?.roles) return false;
    return user.roles.includes(targetRole) || user.roles.includes("MASTER");
  };

  // Exemplo de ação com toast
  function handleAdminAction() {
    try {
      // ...ação administrativa...
      toast.success("Ação administrativa realizada com sucesso!");
    } catch (err) {
      toast.error("Erro ao executar ação administrativa.");
    }
  }

  return (
    <MainLayout>
      <div className={styles.dashboardGrid}>
        {hasRole("DOCTOR") && (
          <div className={styles.card}>
            <h2>Área do Médico</h2>
            <p>Ver meus próximos pacientes...</p>
            <Button onClick={() => navigate("/minhas-consultas")}>
              Agendar consulta
            </Button>
          </div>
        )}

        {hasRole("PATIENT") && (
          <div className={styles.card}>
            <h2>Minhas Consultas</h2>
            <p>Agendar nova consulta...</p>
            <Button onClick={() => navigate("/minhas-consultas")}>
              Agendar consulta
            </Button>
          </div>
        )}

        {hasRole("ADMIN") && (
          <div className={styles.card}>
            <h2>Painel Administrativo</h2>
            <p>Gerenciar usuários...</p>
            <Button onClick={handleAdminAction}>
              Gerenciar usuários
            </Button>
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