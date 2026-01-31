import React, { useState } from "react";
import UserFields from "../user_fields/UserFields";
import AddressFields from "../address_fields/AddressFields";
import styles from "./RegisterForm.module.css";
import Button from "../../ui/button/Button";

export default function RegisterForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    cpf: "",
    fullName: "",
    phoneNumber: "",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addrField = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [addrField]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <UserFields form={form} handleChange={handleChange} loading={loading} />

      <hr className={styles.divider} />

      <AddressFields
        address={form.address}
        handleChange={handleChange}
        loading={loading}
      />

      {error && <p className={styles.errorMessage}>{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Criando conta..." : "Registrar"}
      </Button>
    </form>
  );
}