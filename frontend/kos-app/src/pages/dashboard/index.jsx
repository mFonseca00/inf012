import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./index.module.css";
import logoKos from "../../assets/kos-logo-mono-side.png";

function Dashboard() {
  const { logout, user } = useContext(AuthContext);

  const roleLabels = {
    MASTER: "Administrador Master",
    ADMIN: "Administrador",
    USER: "Usuário",
    PATIENT: "Paciente",
    DOCTOR: "Médico",
    RECEPTIONIST: "Recepção",
  };

  const handleLogout = () => {
    logout();
  };

  // Função auxiliar para verificar permissão
  // Retorna true se o usuário tiver a role OU se for MASTER (que pode tudo)
  const hasRole = (targetRole) => {
    if (!user?.roles) return false;
    return user.roles.includes(targetRole) || user.roles.includes("MASTER");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <img src={logoKos} alt="Logo Kos" className={styles.logo} />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <span className={styles.welcomeText}>
              Olá, <strong>{user?.username}</strong>
            </span>

            <span className={styles.userRole}>
              {roleLabels[user?.mainRole] || user?.mainRole}
            </span>
          </div>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      <main className={styles.content}>
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
          <p>Selecione uma opção no menu.</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
