import React from "react";
import TextField from "../../ui/text_field/TextField";
import { formatCEP, onlyDigits } from "../../../utils/formatters";
import styles from "./AddressFields.module.css";
import StateSelect from "../../ui/selectors/StateSelect";

export default function AddressFields({ 
  address, 
  handleChange, 
  loading,
  disabledIfLinkedPatient = false,
  loadingPatient = false
}) {
  return (
    <>
      <h3 className={styles.sectionTitle}>Endereço</h3>

      {disabledIfLinkedPatient && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#e3f2fd", 
          borderLeft: "4px solid #1976d2",
          marginBottom: "1rem",
          borderRadius: "4px"
        }}>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#1565c0" }}>
            ℹ️ Endereço preenchido automaticamente do paciente vinculado
          </p>
        </div>
      )}

      <div className={styles.gridTwoCols}>
        <TextField
          id="address.street"
          name="address.street"
          label="Rua:"
          value={address.street}
          onChange={handleChange}
          placeholder="Rua"
          disabled={loading || loadingPatient}
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
          disabled={loading || loadingPatient}
          autoComplete="address-line2"
        />
        <TextField
          id="address.district"
          name="address.district"
          label="Bairro:"
          value={address.district}
          onChange={handleChange}
          placeholder="Bairro"
          disabled={loading || loadingPatient}
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
          disabled={loading || loadingPatient}
          autoComplete="address-level2"
          required={true}
        />
        <StateSelect
          id="address.state"
          name="address.state"
          label="Estado:"
          value={address.state}
          onChange={handleChange}
          disabled={loading || loadingPatient}
          required={true}
        />
        <TextField
          id="address.cep"
          name="address.cep"
          label="CEP:"
          value={address.cep}
          onChange={handleChange}
          placeholder="00000-000"
          inputMode="numeric"
          maxLength={9}
          disabled={loading || loadingPatient}
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
          disabled={loading || loadingPatient}
          placeholder="Complemento (opcional)"
          autoComplete="address-line3"
        />
      </div>
    </>
  );
}