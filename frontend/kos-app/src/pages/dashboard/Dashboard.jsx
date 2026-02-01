import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Button from "../../components/ui/button/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Dashboard.module.css";

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
    <div className={styles.dashboardGrid}>
      <div className={styles.card}>
        <h2>Bem-vindo ao Sistema</h2>
        <p>Selecione uma opção no menu lateral para começar.</p>
      </div>
    </div>
  );
}

export default Dashboard;