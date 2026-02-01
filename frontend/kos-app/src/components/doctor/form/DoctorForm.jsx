import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./DoctorForm.module.css";
import Button from "../../ui/button/Button";
import DoctorUserFields from "../../doctor/user_fields/DoctorUserFields";
import AddressFields from "../../auth/address_fields/AddressFields";
import doctorService from "../../../services/doctorService";
import patientService from "../../../services/patientService";
import { toast } from "react-toastify";

const SPECIALITIES = [
  { value: "", label: "Selecione uma especialidade" },
  { value: "ORTOPEDIA", label: "Ortopedia" },
  { value: "CARDIOLOGIA", label: "Cardiologia" },
  { value: "GINECOLOGIA", label: "Ginecologia" },
  { value: "DERMATOLOGIA", label: "Dermatologia" },
];

const INITIAL_FORM_STATE = {
  id: null,
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
};

export default function DoctorForm({ onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [linkedPatient, setLinkedPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [usernameTimeout, setUsernameTimeout] = useState(null);
  const [originalName, setOriginalName] = useState("");

  useEffect(() => {
    if (initialData) {
      // Garantir que todos os campos existam com valores padrão
      const completeData = {
        id: initialData.id || null,
        name: initialData.name || "",
        email: initialData.email || "",
        username: initialData.username || "",
        crm: initialData.crm || "",
        phoneNumber: initialData.phoneNumber || "",
        speciality: initialData.speciality || "",
        address: {
          street: initialData.address?.street || "",
          number: initialData.address?.number || "",
          complement: initialData.address?.complement || "",
          district: initialData.address?.district || "",
          city: initialData.address?.city || "",
          state: initialData.address?.state || "",
          cep: initialData.address?.cep || "",
        },
      };
      
      setFormData(completeData);
      setOriginalName(initialData.name || "");
      setIsEditing(true);
      
      // Buscar dados do paciente vinculado se houver
      if (initialData.username) {
        fetchLinkedPatientForEdit(initialData.username);
      }
    } else {
      // Modo criação - inicializar com estado padrão
      setFormData(INITIAL_FORM_STATE);
      setIsEditing(false);
    }
  }, [initialData]);

  const fetchLinkedPatientForEdit = (username) => {
    if (username) {
      setLoadingPatient(true);
      patientService
        .getByUsername(username)
        .then((patient) => {
          if (patient) {
            setLinkedPatient(patient);
          } else {
            setLinkedPatient(null);
          }
        })
        .catch(() => {
          setLinkedPatient(null);
        })
        .finally(() => {
          setLoadingPatient(false);
        });
    }
  };

  useEffect(() => {
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
            setLinkedPatient(null);
          })
          .finally(() => {
            setLoadingPatient(false);
          });
      }, 500);

      setUsernameTimeout(timeout);
    } else {
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
    if (!isEditing && !formData.email?.trim() && !formData.username?.trim()) {
      toast.warning("Email ou usuário é obrigatório");
      return false;
    }
    if (!formData.phoneNumber?.trim()) {
      toast.warning("Telefone é obrigatório");
      return false;
    }
    if (!isEditing) {
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
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isEditing) {
        const updateData = {
          crm: formData.crm,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        };

        await doctorService.update(updateData);
        
        if (linkedPatient && formData.name !== originalName) {
          try {
            await patientService.update({
              cpf: linkedPatient.cpf,
              name: formData.name,
              phoneNumber: formData.phoneNumber,
              address: formData.address,
            });
            toast.success("Médico e dados do paciente atualizados!");
          } catch (patientErr) {
            toast.warning("Médico atualizado, mas houve erro ao atualizar dados do paciente");
            console.error("Erro ao atualizar paciente:", patientErr);
          }
        } else {
          toast.success("Dados do médico atualizados!");
        }
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
            emailDisabled={isEditing}
            nameDisabled={!isEditing && !!linkedPatient}
            loadingPatient={loadingPatient}
            isEditing={isEditing}
          />

          {!isEditing && (
            <>
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
            </>
          )}

          {isEditing && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>CRM</label>
                <input
                  name="crm"
                  value={formData.crm}
                  className={styles.input}
                  disabled={true}
                  title="CRM não pode ser alterado"
                />
                <span className={styles.helperText}>
                  Campo não pode ser alterado
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Especialidade</label>
                <select
                  name="speciality"
                  value={formData.speciality}
                  className={styles.input}
                  disabled={true}
                  title="Especialidade não pode ser alterada"
                >
                  {SPECIALITIES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className={styles.helperText}>
                  Campo não pode ser alterado
                </span>
              </div>
            </>
          )}

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