import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import styles from "./index.module.css";

function Dashboard() {
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <div className={styles.userInfo}>
          <span>
            Olá, <strong>{user?.username}</strong>
          </span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <h2>Seus Agendamentos</h2>
        <p>Conteúdo do sistema aqui...</p>
      </main>
    </div>
  );
}

export default Dashboard;
