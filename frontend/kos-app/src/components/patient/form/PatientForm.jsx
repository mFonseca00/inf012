import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./PatientForm.module.css";
import Button from "../../ui/button/Button";
import PatientUserFields from "../user_fields/PatientUserFields";
import AddressFields from "../../auth/address_fields/AddressFields";
import patientService from "../../../services/patientService";
import { toast } from "react-toastify";
import doctorService from "../../../services/doctorService";

const INITIAL_FORM_STATE = {
  id: null,
  name: "",
  email: "",
  username: "",
  cpf: "",
  phoneNumber: "",
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

const INITIAL_ADDRESS_STATE = {
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  cep: "",
};

export default function PatientForm({ onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalName, setOriginalName] = useState("");
  const [originalAddress, setOriginalAddress] = useState(INITIAL_ADDRESS_STATE);
  const [linkedDoctor, setLinkedDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(false);
  const [usernameTimeout, setUsernameTimeout] = useState(null);

  useEffect(() => {
    if (initialData) {
      const completeData = {
        id: initialData.id || null,
        name: initialData.name || "",
        email: initialData.email || "",
        username: initialData.username || "",
        cpf: initialData.cpf || "",
        phoneNumber: initialData.phoneNumber || "",
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
      setOriginalAddress(completeData.address);
      setIsEditing(true);

      if (initialData.username) {
        fetchLinkedDoctorForEdit(initialData.username);
      }
    } else {
      setFormData(INITIAL_FORM_STATE);
      setOriginalAddress(INITIAL_ADDRESS_STATE);
      setIsEditing(false);
    }
  }, [initialData]);

  const fetchLinkedDoctorForEdit = (username) => {
    if (username) {
      setLoadingDoctor(true);
      doctorService
        .getByUsername(username)
        .then((doctor) => {
          if (doctor) {
            setLinkedDoctor(doctor);
          } else {
            setLinkedDoctor(null);
          }
        })
        .catch(() => {
          setLinkedDoctor(null);
        })
        .finally(() => {
          setLoadingDoctor(false);
        });
    }
  };

  const preencherDadosMedico = (doctor) => {
    if (doctor) {
      const address = doctor.address || INITIAL_ADDRESS_STATE;

      setFormData((prev) => ({
        ...prev,
        name: doctor.name || prev.name,
        email: doctor.email || prev.email,
        phoneNumber: doctor.phoneNumber || prev.phoneNumber,
        address: {
          street: address.street || "",
          number: address.number || "",
          complement: address.complement || "",
          district: address.district || "",
          city: address.city || "",
          state: address.state || "",
          cep: address.cep || "",
        },
      }));

      setOriginalAddress(address);
    }
  };

  useEffect(() => {
    if (usernameTimeout) {
      clearTimeout(usernameTimeout);
    }

    // Se não está editando e tem username, buscar dados do médico
    if (!isEditing && formData.username && formData.username.length > 2) {
      setLoadingDoctor(true);

      const timeout = setTimeout(() => {
        doctorService
          .getByUsername(formData.username)
          .then((doctor) => {
            if (doctor) {
              setLinkedDoctor(doctor);
              preencherDadosMedico(doctor);
            } else {
              setLinkedDoctor(null);
            }
          })
          .catch(() => {
            setLinkedDoctor(null);
          })
          .finally(() => {
            setLoadingDoctor(false);
          });
      }, 500);

      setUsernameTimeout(timeout);
    } else {
      setLoadingDoctor(false);
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
        address: { ...prev.address, [addrField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    // --- Validação de Nome Reforçada ---
    const nameClean = formData.name?.trim() || "";

    if (!nameClean) {
      toast.warning("Nome é obrigatório");
      return false;
    }

    if (nameClean.length < 3) {
      toast.warning("O nome deve ter pelo menos 3 caracteres.");
      return false;
    }

    // Regex: Permite letras (maiúsculas/minúsculas), acentos, espaços, apóstrofo (') e hífen (-)
    // Bloqueia números e outros símbolos
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    if (!nameRegex.test(nameClean)) {
      toast.warning("O nome não pode conter números ou símbolos especiais.");
      return false;
    }

    // 2. Valida se tem pelo menos duas palavras (Nome + Sobrenome)
    // O split(/\s+/) garante que múltiplos espaços entre os nomes não contem como palavra extra
    const nameParts = nameClean.split(/\s+/);

    if (nameParts.length < 2) {
      toast.warning("Por favor, informe o nome completo (Nome e Sobrenome).");
      return false;
    }
    // ------------------------------------

    if (!isEditing && !formData.email?.trim() && !formData.username?.trim()) {
      toast.warning("Email ou usuário é obrigatório");
      return false;
    }

    if (!formData.phoneNumber?.trim()) {
      toast.warning("Telefone é obrigatório");
      return false;
    }

    if (!isEditing) {
      if (!formData.cpf?.trim()) {
        toast.warning("CPF é obrigatório");
        return false;
      }
      // Validação básica de CPF (formato)
      const cpfClean = formData.cpf.replace(/\D/g, "");
      if (cpfClean.length !== 11) {
        toast.error("CPF inválido. Deve conter 11 dígitos.");
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
          cpf: formData.cpf,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        };

        await patientService.update(updateData);

        const nameChanged = formData.name !== originalName;
        const addrChanged = addressChanged();

        if (linkedDoctor && (nameChanged || addrChanged)) {
          try {
            await doctorService.update({
              crm: linkedDoctor.crm,
              name: formData.name,
              phoneNumber: formData.phoneNumber,
              address: formData.address,
            });
            toast.success("Dados do paciente e médico atualizados!");
          } catch (doctorErr) {
            toast.warning(
              "Paciente atualizado, mas houve erro ao atualizar dados do médico",
            );
            console.error("Erro ao atualizar médico:", doctorErr);
          }
        } else {
          toast.success("Dados do paciente atualizados!");
        }

        setOriginalName(formData.name);
        setOriginalAddress(formData.address);
      } else {
        await patientService.register(formData);
        toast.success("Paciente cadastrado com sucesso!");
      }
      onSuccess();
    } catch (err) {
      let errorMessage = "Erro ao salvar paciente. Verifique os dados.";

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
      console.error("Erro ao salvar paciente:", err);
    } finally {
      setLoading(false);
    }
  };

  const addressChanged = () => {
    return JSON.stringify(formData.address) !== JSON.stringify(originalAddress);
  };

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={() => !loading && onClose()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEditing ? "Editar Paciente" : "Novo Paciente"}</h2>
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
          <PatientUserFields
            username={formData.username}
            name={formData.name}
            email={formData.email}
            phoneNumber={formData.phoneNumber}
            cpf={formData.cpf}
            onChange={handleChange}
            loading={loading}
            usernameDisabled={isEditing}
            emailDisabled={isEditing}
            cpfDisabled={isEditing}
            isEditing={isEditing}
          />

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
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
