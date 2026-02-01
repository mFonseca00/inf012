import React from "react";
import styles from "./StatusFilter.module.css";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "ATIVO", label: "Ativa" },
  { value: "CANCELADO", label: "Cancelada pelo médico" },
  { value: "DESISTENCIA", label: "Cancelada pelo paciente" },
  { value: "REALIZADA", label: "Realizada" },
];

export default function StatusFilter({ value, onChange }) {
  return (
    <div className={styles.filtersRow}>
      <label htmlFor="statusFilter" className={styles.filterLabel}>
        Status:
      </label>
      <select
        id="statusFilter"
        className={styles.filterSelect}
        value={value}
        onChange={onChange}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}