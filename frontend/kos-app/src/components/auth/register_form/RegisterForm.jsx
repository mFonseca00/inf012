import React, { useState } from "react";
import UserFields from "../user_fields/UserFields";
import AddressFields from "../address_fields/AddressFields";
import Button from "../../ui/button/Button";
import styles from "./RegisterForm.module.css";

export default function RegisterForm({ onSubmit, loading }) {
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
      district: "",
      city: "",
      state: "",
      cep: ""
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

    const userData = {
      username: form.username,
      password: form.password,
      confirmPassword: form.confirmPassword,
      email: form.email,
      cpf: form.cpf,
      fullName: form.fullName,
      phoneNumber: form.phoneNumber,
      address: {
        street: form.address.street,
        number: form.address.number,
        complement: form.address.complement,
        district: form.address.district,
        city: form.address.city,
        state: form.address.state,
        cep: form.address.cep
      }
    };

    onSubmit(userData);
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

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Criando conta..." : "Registrar"}
      </Button>
    </form>
  );
}