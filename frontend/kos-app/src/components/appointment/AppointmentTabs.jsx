import React from "react";
import styles from "./AppointmentTabs.module.css";

const TABS = [
  { value: "PATIENT", label: "Como Paciente" },
  { value: "DOCTOR", label: "Como Médico" },
];

export default function AppointmentTabs({ activeTab, onTabChange, isDoctorAndPatient }) {
  if (!isDoctorAndPatient) {
    return null;
  }

  const handleTabClick = (tabValue) => {
    if (activeTab !== tabValue) {
      onTabChange(tabValue);
    }
  };

  return (
    <div className={styles.tabsContainer}>
      {TABS.map((tab) => (
        <button
          key={tab.value}
          className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ""}`}
          onClick={() => handleTabClick(tab.value)}
          aria-selected={activeTab === tab.value}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}