import React from "react";
import TextField from "../../ui/text_field/TextField";
import { formatCEP, onlyDigits } from "../../../utils/formatters";
import styles from "./AddressFields.module.css";

export default function AddressFields({ address, handleChange, loading }) {
  return (
    <>
      <h3 className={styles.sectionTitle}>Endereço</h3>

      <div className={styles.gridTwoCols}>
        <TextField
          id="address.street"
          name="address.street"
          label="Rua:"
          value={address.street}
          onChange={handleChange}
          placeholder="Rua"
          disabled={loading}
          autoComplete="street-address"
          required={true}
        />
        <TextField
          id="address.number"
          name="address.number"
          label="Número:"
          value={address.number}
          onChange={handleChange}
          placeholder="Número (opcional)"
          maxLength={10}
          disabled={loading}
          autoComplete="address-line2"
        />
        <TextField
          id="address.neighborhood"
          name="address.neighborhood"
          label="Bairro:"
          value={address.neighborhood}
          onChange={handleChange}
          placeholder="Bairro"
          disabled={loading}
          autoComplete="address-level3"
          required={true}
        />
        <TextField
          id="address.city"
          name="address.city"
          label="Cidade:"
          value={address.city}
          onChange={handleChange}
          placeholder="Cidade"
          disabled={loading}
          autoComplete="address-level2"
          required={true}
        />
        <TextField
          id="address.state"
          name="address.state"
          label="Estado:"
          value={address.state}
          onChange={handleChange}
          placeholder="Estado"
          maxLength={2}
          disabled={loading}
          autoComplete="address-level1"
          required={true}
        />
        <TextField
          id="address.zipCode"
          name="address.zipCode"
          label="CEP:"
          value={address.zipCode}
          onChange={handleChange}
          placeholder="00000-000"
          inputMode="numeric"
          maxLength={9}
          disabled={loading}
          formatter={formatCEP}
          autoComplete="postal-code"
          required={true}
        />
      </div>
      <div className={styles.fullWidthField}>
        <TextField
          id="address.complement"
          name="address.complement"
          label="Complemento:"
          value={address.complement}
          onChange={handleChange}
          disabled={loading}
          placeholder="Complemento (opcional)"
          autoComplete="address-line3"
        />
      </div>
    </>
  );
}