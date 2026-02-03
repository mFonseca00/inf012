import React from "react";
import TextField from "../../ui/text_field/TextField";
import { formatCEP, capitalizeFirstLetter } from "../../../utils/formatters";
import styles from "./AddressFields.module.css";
import StateSelect from "../../ui/selectors/StateSelect";

export default function AddressFields({ 
  address, 
  handleChange, 
  loading,
  disabledIfLinkedPatient = false,
  loadingPatient = false
}) {
  // Wrapper para aplicar formatação síncrona antes de chamar handleChange
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name.split(".")[1];
    
    let formattedValue = value;
    
    switch (fieldName) {
      // case "street":
      // case "district":
      // case "city":
      // case "complement":
      //   formattedValue = capitalizeFirstLetter(value);
      //   break;
      case "cep":
        formattedValue = formatCEP(value);
        break;
      default:
        formattedValue = value;
    }
    
    // Chamar handleChange com valor já formatado
    handleChange({
      target: { name, value: formattedValue }
    });
  };

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
          onChange={handleAddressChange}
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
          onChange={handleAddressChange}
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
          onChange={handleAddressChange}
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
          onChange={handleAddressChange}
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
          onChange={handleAddressChange}
          disabled={loading || loadingPatient}
          required={true}
        />
        <TextField
          id="address.cep"
          name="address.cep"
          label="CEP:"
          value={address.cep}
          onChange={handleAddressChange}
          placeholder="00000-000"
          inputMode="numeric"
          maxLength={9}
          disabled={loading || loadingPatient}
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
          onChange={handleAddressChange}
          disabled={loading || loadingPatient}
          placeholder="Complemento (opcional)"
          autoComplete="address-line3"
        />
      </div>
    </>
  );
}