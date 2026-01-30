import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./Navbar.module.css";
import logoKos from "../../assets/kos-logo-mono-side.png";
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const roleLabels = {
    MASTER: "Administrador Master",
    ADMIN: "Administrador",
    USER: "Usuário",
    PATIENT: "Paciente",
    DOCTOR: "Médico",
    RECEPTIONIST: "Recepção",
  };

  return (
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

        <button onClick={logout} className={styles.logoutButton}>
          Sair
        </button>
      </div>
    </header>
  );
};

export default Navbar;
