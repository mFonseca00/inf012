import React from "react";
import styles from "./ScheduleSelect.module.css";

export default function DateTimeSelect({ 
  appointmentDate, 
  setAppointmentDate, 
  appointmentTime, 
  setAppointmentTime, 
  disabled 
}) {
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <div className={styles.field}>
        <label>Data *</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          min={getMinDate()}
          disabled={disabled}
        />
      </div>

      <div className={styles.field}>
        <label>Horário *</label>
        <input
          type="time"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          min="07:00"
          max="18:00"
          disabled={disabled}
        />
        <small className={styles.hint}>
          Funcionamento: Segunda a Sábado, 07:00 às 19:00. Consultas duram 1 hora.
        </small>
      </div>
    </>
  );
}