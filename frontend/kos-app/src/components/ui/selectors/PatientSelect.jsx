import React from "react";
import styles from "./ScheduleSelect.module.css";

export default function PatientSelect({ 
  canSelectPatient, 
  patients, 
  selectedPatient, 
  setSelectedPatient, 
  userName,
  disabled 
}) {
  if (!canSelectPatient) {
    return (
      <div className={styles.field}>
        <label>Paciente</label>
        <input type="text" value={userName || "Você"} disabled />
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <label>Paciente *</label>
      <select
        value={selectedPatient}
        onChange={(e) => setSelectedPatient(e.target.value)}
        disabled={disabled}
      >
        <option value="">Selecione um paciente</option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.name}
          </option>
        ))}
      </select>
    </div>
  );
}