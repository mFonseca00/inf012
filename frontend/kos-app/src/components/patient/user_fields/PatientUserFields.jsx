import React from "react";
import TextField from "../../ui/text_field/TextField";
import { formatPhone, formatCPF, isValidEmail, formatName } from "../../../utils/formatters";
import styles from "./PatientUserFields.module.css";

export default function PatientUserFields({ 
  username, 
  name, 
  email, 
  phoneNumber,
  cpf,
  onChange, 
  loading,
  usernameDisabled,
  emailDisabled,
  cpfDisabled,
  isEditing
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
          disabled={loading}
          placeholder="Nome completo do paciente"
          autoComplete="name"
          formatter={formatName}
          required={true}
        />
      </div>

      <div className={styles.gridTwoCols}>
        <div className={styles.fieldContainer}>
          <TextField
            id="cpf"
            name="cpf"
            label="CPF:"
            value={cpf}
            onChange={onChange}
            placeholder="000.000.000-00"
            inputMode="numeric"
            maxLength={14}
            disabled={loading || cpfDisabled}
            formatter={formatCPF}
            autoComplete="off"
            required={true}
          />
          {cpfDisabled && (
            <span className={styles.helperText}>
              CPF não pode ser alterado
            </span>
          )}
        </div>
        <div className={styles.fieldContainer}>
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
        </div>
      </div>

      <div className={styles.gridTwoCols}>
        <div className={styles.fieldContainer}>
          <TextField
            id="email"
            name="email"
            label="Email:"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="email@exemplo.com"
            disabled={loading || emailDisabled || (!isEditing && !!username)}
            autoComplete="email"
            required={!isEditing && !username}
            errorMessage={emailError}
          />
          {emailDisabled && (
            <span className={styles.helperText}>
              Email não pode ser alterado
            </span>
          )}
        </div>
        <div className={styles.fieldContainer}>
          <TextField
            id="username"
            name="username"
            label="Usuário:"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Nome de usuário"
            disabled={loading || usernameDisabled || (!isEditing && !!email)}
            autoComplete="username"
            required={!isEditing && !email}
            errorMessage={usernameError}
          />
          {usernameDisabled && (
            <span className={styles.helperText}>
              Usuário não pode ser alterado
            </span>
          )}
        </div>
      </div>
    </>
  );
}
