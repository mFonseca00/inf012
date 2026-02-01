import React from "react";
import styles from "./AppointmentListSkeleton.module.css";
import Button from "../ui/button/Button";

export default function AppointmentListSkeleton({ title = "Meus Agendamentos" }) {
  return (
    <div className={styles.appointmentListContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <Button className={styles.btnNew} disabled>
          Agendar nova consulta
        </Button>
      </div>
      <div className={styles.gridContainer}>
        {[1, 2, 3, 4].map((i) => (
          <div className={styles.skeletonCard} key={i}>
            <div className={`${styles.skeletonLine} ${styles.short}`}></div>
            <div className={`${styles.skeletonLine} ${styles.medium}`}></div>
            <div className={`${styles.skeletonLine}`}></div>
            <div className={`${styles.skeletonLine} ${styles.tiny}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}