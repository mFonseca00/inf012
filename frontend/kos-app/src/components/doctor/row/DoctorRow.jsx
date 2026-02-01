import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "./DoctorRow.module.css";
import Button from "../../ui/button/Button";
import doctorService from "../../../services/doctorService";

export default function DoctorRow({ doctor, onActionSuccess, onEdit }) {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleInactivate = async () => {
    setLoading(true);
    try {
      await doctorService.inactivate({ crm: doctor.crm });
      toast.success("Médico inativado com sucesso!");
      if (onActionSuccess) onActionSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao inativar médico");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleReactivate = async () => {
    setLoading(true);
    try {
      await doctorService.reactivate({ crm: doctor.crm });
      toast.success("Médico reativado com sucesso!");
      if (onActionSuccess) onActionSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao reativar médico");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleEdit = async () => {
    try {
      const completeDoctorData = await doctorService.getDoctorInfo(doctor.crm);
      if (onEdit) {
        onEdit(completeDoctorData);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do médico para edição");
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

  return (
    <>
      <div className={styles.row}>
        <div className={styles.cellName}>
          <span className={styles.name}>{doctor.name}</span>
        </div>

        <div className={styles.cellEmail}>
          <span>{doctor.email}</span>
        </div>

        <div className={styles.cellCrm}>
          <span>{doctor.crm}</span>
        </div>

        <div className={styles.cellSpeciality}>
          <span>{doctor.speciality}</span>
        </div>

        <div className={styles.cellStatus}>
          <span className={`${styles.statusBadge} ${styles[doctor.isActive ? 'active' : 'inactive']}`}>
            {doctor.isActive ? "Ativo" : "Inativo"}
          </span>
        </div>

        <div className={styles.cellActions}>
          <button
            className={styles.btnEdit}
            onClick={handleEdit}
            disabled={loading}
            title="Editar médico"
          >
            ✏️ Editar
          </button>
          {doctor.isActive && (
            <button
              className={styles.btnInactivate}
              onClick={() => openConfirmModal("inactivate")}
              disabled={loading}
              title="Inativar médico"
            >
              ⊘ Inativar
            </button>
          )}
          {!doctor.isActive && (
            <button
              className={styles.btnReactivate}
              onClick={() => openConfirmModal("reactivate")}
              disabled={loading}
              title="Reativar médico"
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
                ? `Deseja realmente inativar o médico ${doctor.name}?`
                : `Deseja realmente ativar o médico ${doctor.name}?`}
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