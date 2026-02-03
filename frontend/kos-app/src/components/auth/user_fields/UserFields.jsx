import React from "react";
import TextField from "../../ui/text_field/TextField";
import { formatCPF, formatPhone, isValidEmail, isValidPassword, formatName } from "../../../utils/formatters";
import styles from "./UserFields.module.css";

export default function UserFields({ form, handleChange, loading }) {
  const [passwordError, setPasswordError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

  function handlePasswordChange(e) {
    handleChange(e);
    const result = isValidPassword(e.target.value);
    setPasswordError(result.valid ? "" : result.message);
    
    if (form.confirmPassword && e.target.value !== form.confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem");
    } else {
      setConfirmPasswordError("");
    }
  }

  function handleEmailChange(e) {
    handleChange(e);
    const value = e.target.value;
    if (value && !isValidEmail(value)) {
      setEmailError("E-mail inválido");
    } else {
      setEmailError("");
    }
  }

  function handleConfirmPasswordChange(e) {
    handleChange(e);
    const value = e.target.value;
    if (value && value !== form.password) {
      setConfirmPasswordError("As senhas não coincidem");
    } else {
      setConfirmPasswordError("");
    }
  }

  return (
    <>
      <div className={styles.fullWidthField}>
        <TextField
          id="fullName"
          name="fullName"
          label="Nome completo:"
          value={form.fullName}
          onChange={handleChange}
          disabled={loading}
          placeholder="Seu nome completo"
          autoComplete="name"
          formatter={formatName}
          required={true}
        />
      </div>

      <div className={styles.gridTwoCols}>
        <TextField
          id="cpf"
          name="cpf"
          label="CPF:"
          value={form.cpf}
          onChange={handleChange}
          placeholder="000.000.000-00"
          inputMode="numeric"
          maxLength={14}
          disabled={loading}
          formatter={formatCPF}
          autoComplete="off"
          required={true}
        />
        <TextField
          id="phoneNumber"
          name="phoneNumber"
          label="Telefone:"
          value={form.phoneNumber}
          onChange={handleChange}
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
          value={form.username}
          onChange={handleChange}
          placeholder="Escolha seu usuário"
          disabled={loading}
          autoComplete="username"
          required={true}
        />
        <div>
          <TextField
            id="email"
            name="email"
            label="E-mail:"
            type="email"
            value={form.email}
            onChange={handleEmailChange}
            placeholder="seu@email.com"
            disabled={loading}
            autoComplete="email"
            required={true}
          />
          {emailError && (
            <span className={styles.errorText}>{emailError}</span>
          )}
        </div>
        <div>
          <TextField
            id="password"
            name="password"
            label="Senha:"
            type="password"
            value={form.password}
            onChange={handlePasswordChange}
            placeholder="Senha forte"
            disabled={loading}
            autoComplete="new-password"
            required={true}
          />
          {passwordError && (
            <span className={styles.errorText}>{passwordError}</span>
          )}
        </div>
        <div>
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar Senha:"
            type="password"
            value={form.confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Repita a senha"
            disabled={loading}
            autoComplete="new-password"
            required={true}
          />
          {confirmPasswordError && (
            <span className={styles.errorText}>{confirmPasswordError}</span>
          )}
        </div>
      </div>
    </>
  );
}