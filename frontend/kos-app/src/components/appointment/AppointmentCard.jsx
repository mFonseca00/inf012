import React from "react";
import styles from "./AppointmentCard.module.css";

export default function AppointmentCard({ consulta, getStatusStyle, getStatusLabel }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.dateBadge}>
          <span className={styles.day}>{consulta.data.split("/")[0]}</span>
          <span className={styles.monthYear}>
            {consulta.data.split("/")[1]}/{consulta.data.split("/")[2]}
          </span>
        </div>
        <div className={styles.timeInfo}>
          <i className="pi pi-clock"></i> 🕒 {consulta.hora}
        </div>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.doctorName}>{consulta.medico}</h3>
        <p className={styles.specialty}>{consulta.especialidade}</p>
      </div>
      <div className={styles.cardFooter}>
        <span className={`${styles.statusBadge} ${getStatusStyle(consulta.status)}`}>
          {getStatusLabel(consulta.status)}
        </span>
        <button className={styles.btnDetails}>Detalhes</button>
      </div>
    </div>
  );
}