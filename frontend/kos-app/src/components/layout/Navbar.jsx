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
    // Caso o Spring mande com prefixo:
    ROLE_MASTER: "Administrador Master",
    ROLE_ADMIN: "Administrador",
    ROLE_DOCTOR: "Médico",
  };

  // [CORREÇÃO]: Lógica para descobrir a role atual
  // 1. Tenta pegar a primeira role da lista (padrão do DTO novo)
  // 2. Fallback para mainRole (caso tenha algum legado)
  // 3. Fallback para string vazia
  const currentRoleCode = user?.roles?.[0] || user?.mainRole || "";

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
            {/* Usa a variável calculada acima */}
            {roleLabels[currentRoleCode] || currentRoleCode}
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
