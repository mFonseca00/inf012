import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Função auxiliar para verificar permissão
  const hasRole = (rolesPermitidas) => {
    if (!user?.roles) return false;
    // Se for MASTER, sempre retorna true
    if (user.roles.includes("MASTER")) return true;
    // Verifica se tem alguma das roles permitidas
    return rolesPermitidas.some((r) => user.roles.includes(r));
  };

  // Helper para classe ativa
  const isActive = (path) => (location.pathname === path ? styles.active : "");

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link to="/dashboard" className={isActive("/dashboard")}>
              Dashboard
            </Link>
          </li>

          {/* Menu para Pacientes e Atendentes */}
          {hasRole(["PATIENT", "RECEPTIONIST"]) && (
            <li>
              <Link to="/appointments" className={isActive("/appointments")}>
                Meus Agendamentos
              </Link>
            </li>
          )}

          {/* Menu para Médicos */}
          {hasRole(["DOCTOR"]) && (
            <li>
              <Link
                to="/doctor/schedule"
                className={isActive("/doctor/schedule")}
              >
                Minha Agenda
              </Link>
            </li>
          )}

          {/* Menu Administrativo (Admin, Master, Recepção) */}
          {hasRole(["ADMIN", "RECEPTIONIST"]) && (
            <>
              <li className={styles.sectionTitle}>Gerenciamento</li>
              <li>
                <Link to="/patients" className={isActive("/patients")}>
                  Pacientes
                </Link>
              </li>
              <li>
                <Link to="/doctors" className={isActive("/doctors")}>
                  Médicos
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
