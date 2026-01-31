import React from "react";
import styles from "./TextField.module.css";
import LabelWithAsterisk from "./LabelWithAsterisk";

export default function TextField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  inputMode,
  maxLength,
  disabled,
  formatter,
  autoComplete,
  required = false
}) {
  function handleChange(e) {
    let val = e.target.value;
    if (formatter) val = formatter(val);
    onChange({ target: { name, value: val } });
  }

  return (
    <div className={styles.inputGroup}>
      <LabelWithAsterisk required={required}>{label}</LabelWithAsterisk>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        className={styles.textBox}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  );
}