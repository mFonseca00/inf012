import React from "react";
import styles from "./DoctorListSkeleton.module.css";
import Button from "../../ui/button/Button";

export default function DoctorListSkeleton({ title = "Gerenciamento de Médicos" }) {
  return (
    <div className={styles.doctorListContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <Button className={styles.btnNew} disabled>
          Adicionar novo médico
        </Button>
      </div>

      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>Nome</div>
        <div className={styles.headerCell}>CRM</div>
        <div className={styles.headerCell}>Telefone</div>
        <div className={styles.headerCell}>Status</div>
        <div className={styles.headerCell}>Ações</div>
      </div>

      <div className={styles.rowsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div className={styles.skeletonRow} key={i}>
            <div className={`${styles.skeletonLine} ${styles.medium}`}></div>
            <div className={`${styles.skeletonLine} ${styles.short}`}></div>
            <div className={`${styles.skeletonLine} ${styles.short}`}></div>
            <div className={`${styles.skeletonLine} ${styles.tiny}`}></div>
            <div className={`${styles.skeletonLine} ${styles.short}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}