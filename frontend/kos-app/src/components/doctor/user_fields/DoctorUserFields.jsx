import React from "react";
import TextField from "../../ui/text_field/TextField";
import { formatPhone, isValidEmail } from "../../../utils/formatters";
import styles from "./DoctorUserFields.module.css";

export default function DoctorUserFields({ 
  username, 
  name, 
  email, 
  phoneNumber, 
  onChange, 
  loading,
  usernameDisabled,
  emailDisabled,
  nameDisabled,
  loadingPatient,
  isEditing,
  hasLinkedPatient
}) {
  const [emailError, setEmailError] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");

  function handleEmailChange(e) {
    onChange(e);
    const value = e.target.value;
    
    if (value && !isValidEmail(value)) {
      setEmailError("E-mail inválido");
    } else {
      setEmailError("");
    }
    
    if (!isEditing && value && username) {
      onChange({ target: { name: "username", value: "" } });
    }
  }

  function handleUsernameChange(e) {
    onChange(e);
    const value = e.target.value;
    
    if (value && value.length < 3) {
      setUsernameError("Usuário deve ter pelo menos 3 caracteres");
    } else {
      setUsernameError("");
    }
    
    if (!isEditing && value && email) {
      onChange({ target: { name: "email", value: "" } });
    }
  }

  return (
    <>
      <div className={styles.fullWidthField}>
        <TextField
          id="name"
          name="name"
          label="Nome completo:"
          value={name}
          onChange={onChange}
          disabled={loading || nameDisabled || loadingPatient}
          placeholder="Seu nome completo"
          autoComplete="name"
          required={true}
        />
        {nameDisabled && (
          <span className={styles.helperText}>
            Nome preenchido automaticamente do paciente vinculado
          </span>
        )}
      </div>

      <div className={styles.gridTwoCols}>
        <TextField
          id="phoneNumber"
          name="phoneNumber"
          label="Telefone:"
          value={phoneNumber}
          onChange={onChange}
          placeholder="(99) 99999-9999"
          inputMode="tel"
          maxLength={15}
          disabled={loading}
          formatter={formatPhone}
          autoComplete="tel"
          required={true}
        />
        <TextField
          id="username"
          name="username"
          label="Usuário:"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Escolha seu usuário"
          disabled={loading || usernameDisabled || (!isEditing && !!email)}
          autoComplete="username"
          required={!isEditing && !email}
        />
      </div>

      <div className={styles.fullWidthField}>
        <TextField
          id="email"
          name="email"
          label="E-mail:"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="seu@email.com"
          disabled={loading || emailDisabled || (!isEditing && !!username)}
          autoComplete="email"
          required={!isEditing && !username}
        />
        {emailError && (
          <span className={styles.errorText}>{emailError}</span>
        )}
        {usernameError && (
          <span className={styles.errorText}>{usernameError}</span>
        )}
        {emailDisabled && (
          <span className={styles.helperText}>
            Campo não pode ser alterado na edição
          </span>
        )}
        {hasLinkedPatient && !isEditing && (
          <span className={styles.helperText}>
            Dados preenchidos automaticamente do paciente vinculado
          </span>
        )}
      </div>
    </>
  );
}