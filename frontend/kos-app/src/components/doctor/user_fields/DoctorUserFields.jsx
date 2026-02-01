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
  usernameDisabled 
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
    
    // Se preencheu email, limpa username
    if (value && username) {
      onChange({ target: { name: "username", value: "" } });
    }
  }

  function handleUsernameChange(e) {
    onChange(e);
    const value = e.target.value;
    
    if (value && value.length < 3) {
      setUsernameError("Usuário deve ter ser preenchido por completo");
    } else {
      setUsernameError("");
    }
    
    // Se preencheu username, limpa email
    if (value && email) {
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
          placeholder="Seu nome completo"
          autoComplete="name"
          required={true}
        />
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
          disabled={loading || usernameDisabled || !!email}
          autoComplete="username"
          required={!email}
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
          disabled={loading || !!username}
          autoComplete="email"
          required={!username}
        />
        {emailError && (
          <span className={styles.errorText}>{emailError}</span>
        )}
        {usernameError && (
          <span className={styles.errorText}>{usernameError}</span>
        )}
      </div>
    </>
  );
}