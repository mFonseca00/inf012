import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "./PatientRow.module.css";
import Button from "../../ui/button/Button";
import patientService from "../../../services/patientService";

export default function PatientRow({ patient, onActionSuccess, onEdit }) {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleInactivate = async () => {
    setLoading(true);
    try {
      await patientService.inactivate({ cpf: patient.cpf });
      toast.success("Paciente inativado com sucesso!");
      if (onActionSuccess) onActionSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao inativar paciente");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleReactivate = async () => {
    setLoading(true);
    try {
      await patientService.reactivate({ cpf: patient.cpf });
      toast.success("Paciente reativado com sucesso!");
      if (onActionSuccess) onActionSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao reativar paciente");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleEdit = async () => {
    try {
      const completePatientData = await patientService.getPatientInfo(patient.cpf);
      if (onEdit) {
        onEdit(completePatientData);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do paciente para edição");
      console.error("Erro:", error);
    }
  };

  const openConfirmModal = (type) => {
    setActionType(type);
    setShowConfirmModal(true);
  };

  const executeAction = () => {
    if (actionType === "inactivate") {
      handleInactivate();
    } else if (actionType === "reactivate") {
      handleReactivate();
    }
  };

  const formatCPFDisplay = (cpf) => {
    if (!cpf) return "";
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11) return cpf;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  };

  return (
    <>
      <div className={styles.row}>
        <div className={styles.cellName}>
          <span className={styles.name}>{patient.name}</span>
        </div>

        <div className={styles.cellEmail}>
          <span>{patient.email}</span>
        </div>

        <div className={styles.cellCpf}>
          <span>{formatCPFDisplay(patient.cpf)}</span>
        </div>        

        <div className={styles.cellStatus}>
          <span className={`${styles.statusBadge} ${styles[patient.isActive ? 'active' : 'inactive']}`}>
            {patient.isActive ? "Ativo" : "Inativo"}
          </span>
        </div>

        <div className={styles.cellActions}>
          <button
            className={styles.btnEdit}
            onClick={handleEdit}
            disabled={loading}
            title="Editar paciente"
          >
            ✏️ Editar
          </button>
          {patient.isActive && (
            <button
              className={styles.btnInactivate}
              onClick={() => openConfirmModal("inactivate")}
              disabled={loading}
              title="Inativar paciente"
            >
              ⊘ Inativar
            </button>
          )}
          {!patient.isActive && (
            <button
              className={styles.btnReactivate}
              onClick={() => openConfirmModal("reactivate")}
              disabled={loading}
              title="Reativar paciente"
            >
              ✓ Ativar
            </button>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className={styles.modal} onClick={() => setShowConfirmModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>
              {actionType === "inactivate" ? "Confirmar inativação" : "Confirmar ativação"}
            </h3>
            <p>
              {actionType === "inactivate"
                ? `Deseja realmente inativar o paciente ${patient.name}?`
                : `Deseja realmente ativar o paciente ${patient.name}?`}
            </p>
            <div className={styles.modalActions}>
              <Button 
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                variant={actionType === "inactivate" ? "danger" : "confirm"}
                onClick={executeAction}
                disabled={loading}
              >
                {loading 
                  ? (actionType === "inactivate" ? "Inativando..." : "Ativando...")
                  : (actionType === "inactivate" ? "Inativar" : "Ativar")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
