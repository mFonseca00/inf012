import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import styles from "./index.module.css";

function Dashboard() {
  // 1. Buscamos a função logout e os dados do usuário no contexto
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    // Não precisa de navigate("/");
    // O PrivateRoute vai detectar que o user virou null e redirecionar sozinho.
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <div className={styles.userInfo}>
          <span>
            Olá, <strong>{user?.username}</strong>
          </span>

          {/* 2. O botão que chama a função */}
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
