import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./DoctorForm.module.css";
import Button from "../../ui/button/Button";
import DoctorUserFields from "../../doctor/user_fields/DoctorUserFields";
import AddressFields from "../../auth/address_fields/AddressFields";
import doctorService from "../../../services/doctorService";
import { toast } from "react-toastify";
import patientService from "../../../services/patientService";

const SPECIALITIES = [
  { value: "", label: "Selecione uma especialidade" },
  { value: "ORTOPEDIA", label: "Ortopedia" },
  { value: "CARDIOLOGIA", label: "Cardiologia" },
  { value: "GINECOLOGIA", label: "Ginecologia" },
  { value: "DERMATOLOGIA", label: "Dermatologia" },
];

export default function DoctorForm({ onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    crm: "",
    phoneNumber: "",
    speciality: "",
    address: {
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
      cep: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [linkedPatient, setLinkedPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [usernameTimeout, setUsernameTimeout] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(true);
    }
  }, [initialData]);

  useEffect(() => {
    // Limpar timeout anterior
    if (usernameTimeout) {
      clearTimeout(usernameTimeout);
    }

    // Se não está editando e tem username, buscar dados do paciente
    if (!isEditing && formData.username && formData.username.length > 2) {
      setLoadingPatient(true);

      const timeout = setTimeout(() => {
        patientService
          .getByUsername(formData.username)
          .then((patient) => {
            if (patient) {
              setLinkedPatient(patient);
              // Pré-preencher nome com o nome do paciente
              setFormData((prev) => ({
                ...prev,
                name: patient.name || "",
              }));
            } else {
              setLinkedPatient(null);
            }
          })
          .catch(() => {
            // Silenciosamente ignorar erro (usuário pode não estar vinculado a paciente)
            setLinkedPatient(null);
          })
          .finally(() => {
            setLoadingPatient(false);
          });
      }, 500);

      setUsernameTimeout(timeout);
    } else {
      setLinkedPatient(null);
      setLoadingPatient(false);
    }

    return () => {
      if (usernameTimeout) {
        clearTimeout(usernameTimeout);
      }
    };
  }, [formData.username, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("address.")) {
      const addrField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addrField]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.name?.trim()) {
      toast.warning("Nome é obrigatório");
      return false;
    }
    if (!formData.email?.trim() && !formData.username?.trim()) {
      toast.warning("Email ou usuário é obrigatório");
      return false;
    }
    if (!formData.phoneNumber?.trim()) {
      toast.warning("Telefone é obrigatório");
      return false;
    }
    if (!formData.crm?.trim()) {
      toast.warning("CRM é obrigatório");
      return false;
    }
    const crmRegex = /^(\d{6}-\d{2}\/[A-Z]{2}|\d{8}[A-Z]{2})$/;
    if (!crmRegex.test(formData.crm.trim())) {
      toast.error("CRM inválido. Formato: 123456-78/UF");
      return false;
    }
    if (!formData.speciality) {
      toast.warning("Especialidade é obrigatória");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isEditing) {
        await doctorService.update(formData);
        toast.success("Dados do médico atualizados!");
      } else {
        await doctorService.register(formData);
        toast.success("Médico cadastrado com sucesso!");
      }
      onSuccess();
    } catch (err) {
    let errorMessage = "Erro ao salvar médico. Verifique os dados.";
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.fieldErrors) {
      const fieldErrors = Object.entries(err.response.data.fieldErrors)
        .map(([field, error]) => `${field}: ${error}`)
        .join(", ");
      errorMessage = fieldErrors;
    } else if (typeof err.response?.data === "string") {
      errorMessage = err.response.data;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    toast.error(errorMessage);
    console.error("Erro ao salvar médico:", err);
  } finally {
    setLoading(false);
  }
  };

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={() => !loading && onClose()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEditing ? "Editar Médico" : "Novo Médico"}</h2>
          <button 
            className={styles.closeBtn} 
            onClick={onClose} 
            disabled={loading}
            type="button"
          >
            ✕
          </button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit}>
          <DoctorUserFields
            username={formData.username}
            name={formData.name}
            email={formData.email}
            phoneNumber={formData.phoneNumber}
            onChange={handleChange}
            loading={loading}
            usernameDisabled={isEditing}
            nameDisabled={!isEditing && !!linkedPatient}
            loadingPatient={loadingPatient}
          />

          <div className={styles.formGroup}>
            <label className={styles.label}>CRM</label>
            <input
              name="crm"
              value={formData.crm}
              onChange={handleChange}
              required
              placeholder="Ex: 123456-78/UF"
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Especialidade</label>
            <select
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={loading}
            >
              {SPECIALITIES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <AddressFields
            address={formData.address}
            handleChange={handleChange}
            loading={loading}
          />

          <div className={styles.footer}>
            <Button 
              variant="secondary" 
              type="button" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}