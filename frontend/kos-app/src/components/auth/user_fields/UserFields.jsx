import React from "react";
import TextField from "../../ui/text_field/TextField";
import { formatCPF, formatPhone } from "../../../utils/formatters";
import styles from "./UserFields.module.css";

export default function UserFields({ form, handleChange, loading }) {
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
        <TextField
          id="email"
          name="email"
          label="E-mail:"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          disabled={loading}
          autoComplete="email"
          required={true}
        />
        <TextField
          id="password"
          name="password"
          label="Senha:"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Senha forte"
          disabled={loading}
          autoComplete="new-password"
          required={true}
        />
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar Senha:"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Repita a senha"
          disabled={loading}
          autoComplete="new-password"
          required={true}
        />
      </div>
    </>
  );
}