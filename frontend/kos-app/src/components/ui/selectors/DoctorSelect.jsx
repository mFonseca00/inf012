import React from "react";
import styles from "./ScheduleSelect.module.css";

export default function DoctorSelect({ 
  doctors, 
  selectedDoctor, 
  setSelectedDoctor, 
  disabled,
  hint,
  showAutoSelect = true
}) {
  return (
    <div className={styles.field}>
      <label>Médico {showAutoSelect ? "(opcional)" : "*"}</label>
      <select
        value={selectedDoctor}
        onChange={(e) => setSelectedDoctor(e.target.value)}
        disabled={disabled}
      >
        {showAutoSelect && (
          <option value="">Selecionar automaticamente</option>
        )}
        {!showAutoSelect && !selectedDoctor && (
          <option value="">Selecione um médico</option>
        )}
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            Dr(a). {doctor.name} - {doctor.speciality}
          </option>
        ))}
      </select>
      {hint && <small className={styles.hint}>{hint}</small>}
    </div>
  );
}