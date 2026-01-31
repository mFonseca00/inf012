import React from "react";
import styles from "./Button.module.css";

export default function Button({
  children,
  type = "button",
  disabled,
  onClick,
  className = "",
  variant = "primary",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}