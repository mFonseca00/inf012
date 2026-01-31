import React from "react";
import styles from "./LabelWithAsterisk.module.css";

export default function LabelWithAsterisk({ children, required }) {
  return (
    <label>
      {children}
      {required && <span className={styles.asterisk}>*</span>}
    </label>
  );
}