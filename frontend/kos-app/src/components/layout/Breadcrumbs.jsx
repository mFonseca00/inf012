import React from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

const routeNames = {
  dashboard: "Dashboard",
  patients: "Pacientes",
  doctors: "Médicos",
  appointments: "Agendamentos",
  settings: "Configurações",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className={styles.breadcrumbs}>
      <Link to="/dashboard">Home</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        // Não criar link se for a última página (página atual)
        const isLast = index === pathnames.length - 1;

        // Traduz o nome da rota ou usa o próprio nome se não achar
        const displayName = routeNames[value] || value;

        return (
          <span key={to} className={styles.item}>
            <span className={styles.separator}>/</span>
            {isLast ? (
              <span className={styles.current}>{displayName}</span>
            ) : (
              <Link to={to}>{displayName}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
