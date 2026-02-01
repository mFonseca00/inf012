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
    return rolesPermitidas.some((r) => user.roles.includes(r));
  };

  const hasPatientAndDoctor = () => {
    if (!user?.roles) return false;
    return user.roles.includes("DOCTOR") && user.roles.includes("PATIENT");
  };

  // Helper para classe ativa
  const isActive = (path) => (location.pathname === path ? styles.active : "");

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>

          {/* Menu para Pacientes*/}
          {hasRole(["PATIENT"]) && !hasPatientAndDoctor() && (
            <li>
              <Link to="/appointments" className={isActive("/appointments")}>
                Meus Agendamentos
              </Link>
            </li>
          )}

          {/* Menu para Médicos */}
          {hasRole(["DOCTOR"]) && !hasPatientAndDoctor() && (
            <li>
              <Link to="/appointments" className={isActive("/appointments")}>
                Minha Agenda
              </Link>
            </li>
          )}

          {/* Menu para Médicos que também são Pacientes */}
          {hasPatientAndDoctor() && (
            <li>
              <Link to="/appointments" className={isActive("/appointments")}>
                Meus Agendamentos
              </Link>
            </li>
          )}

          {/* Menu Administrativo (Admin, Master) */}
          {hasRole(["ADMIN", "MASTER"]) && (
            <>
              <li>
                <Link to="/dashboard" className={isActive("/dashboard")}>
                  Dashboard
                </Link>
              </li>
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
              <li>
                <Link to="/appointments" className={isActive("/appointments")}>
                  Consultas
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
