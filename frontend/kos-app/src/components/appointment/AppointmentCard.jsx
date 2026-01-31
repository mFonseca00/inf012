import React from "react";
import styles from "./AppointmentCard.module.css";

// Mapeamento dos status reais do backend para cor e label
const STATUS_MAP = {
  ATIVO: {
    label: "Ativa",
    className: styles.statusConfirmed,
  },
  CANCELADO: {
    label: "Cancelada pelo médico",
    className: styles.statusCanceled,
  },
  DESISTENCIA: {
    label: "Cancelada pelo paciente",
    className: styles.statusCanceled,
  },
  REALIZADA: {
    label: "Realizada",
    className: styles.statusConfirmed,
  },
};

export default function AppointmentCard({ consulta, viewMode = "PATIENT" }) {
  const dateObj = consulta.appointmentDate ? new Date(consulta.appointmentDate) : null;

  const day = dateObj ? String(dateObj.getDate()).padStart(2, "0") : "--";
  const month = dateObj ? String(dateObj.getMonth() + 1).padStart(2, "0") : "--";
  const year = dateObj ? dateObj.getFullYear() : "--";
  const hour = dateObj ? String(dateObj.getHours()).padStart(2, "0") : "--";
  const minute = dateObj ? String(dateObj.getMinutes()).padStart(2, "0") : "--";

  // Define qual nome exibir baseado no viewMode
  // Se viewMode é DOCTOR, mostra o paciente. Se é PATIENT, mostra o médico.
  const displayName = viewMode === "DOCTOR" 
    ? (consulta.patientName || "Paciente não informado")
    : (consulta.doctorName || "Médico não informado");

  const specialty = viewMode === "DOCTOR"
    ? (consulta.patientName ? "" : "") // Paciente não tem especialidade
    : (consulta.doctorSpeciality || "Especialidade não informada");

  const status = consulta.appointmentStatus;

  // Busca label e classe do status
  const statusInfo = STATUS_MAP[status] || {
    label: status,
    className: "",
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.dateBadge}>
          <span className={styles.day}>{day}</span>
          <span className={styles.monthYear}>
            {month}/{year}
          </span>
        </div>
        <div className={styles.timeInfo}>
          <i className="pi pi-clock"></i> 🕒 {hour}:{minute}
        </div>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.doctorName}>{displayName}</h3>
        {specialty && <p className={styles.specialty}>{specialty}</p>}
      </div>
      <div className={styles.cardFooter}>
        <span className={`${styles.statusBadge} ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
        <button className={styles.btnDetails}>Detalhes</button>
      </div>
    </div>
  );
}