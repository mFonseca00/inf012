import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../contexts/AuthContext";
import styles from "./AppointmentCard.module.css";
import CancelModal from "../cancel/AppointmentCancelModal";
import appointmentService from "../../../services/appointmentService";

const STATUS_MAP = {
  ATIVA: { label: "Ativa", className: styles.statusConfirmed },
  CANCELADA: { label: "Cancelada pelo médico", className: styles.statusCanceled },
  DESISTENCIA: { label: "Cancelada pelo paciente", className: styles.statusCanceled },
  REALIZADA: { label: "Realizada", className: styles.statusConfirmed },
};

export default function AppointmentCard({ consulta, viewMode = "PATIENT", onActionSuccess }) {
  const { user } = useContext(AuthContext);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(consulta.appointmentStatus);

  const dateObj = consulta.appointmentDate ? new Date(consulta.appointmentDate) : null;
  const day = dateObj ? String(dateObj.getDate()).padStart(2, "0") : "--";
  const month = dateObj ? String(dateObj.getMonth() + 1).padStart(2, "0") : "--";
  const year = dateObj ? dateObj.getFullYear() : "--";
  const hour = dateObj ? String(dateObj.getHours()).padStart(2, "0") : "--";
  const minute = dateObj ? String(dateObj.getMinutes()).padStart(2, "0") : "--";

  const displayName = viewMode === "DOCTOR" 
    ? (consulta.patientName || "Paciente não informado")
    : (consulta.doctorName || "Médico não informado");

  const specialty = viewMode === "DOCTOR" ? "" : (consulta.doctorSpeciality || "");

  const statusInfo = STATUS_MAP[localStatus] || { label: localStatus, className: "" };

  const isAppointmentActive = localStatus === "ATIVA";

  // Define o status de cancelamento baseado no viewMode
  const cancelStatus = viewMode === "DOCTOR" ? "CANCELADA" : "DESISTENCIA";

  // Botão de concluir só aparece quando viewMode é DOCTOR
  // Admin/Master sempre pode concluir independente do viewMode
  const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("MASTER");
  const canConclude = viewMode === "DOCTOR" || isAdmin;

  const handleConclude = async () => {
    setLoading(true);
    try {
      await appointmentService.concludeAppointment(consulta.id);
      toast.success("Consulta concluída com sucesso!");
      setLocalStatus("REALIZADA");
      if (onActionSuccess) onActionSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao concluir consulta");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSuccess = () => {
    setLocalStatus(cancelStatus);
    setShowCancelModal(false);
    if (onActionSuccess) onActionSuccess();
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.dateBadge}>
            <span className={styles.day}>{day}</span>
            <span className={styles.monthYear}>{month}/{year}</span>
          </div>
          <div className={styles.timeInfo}>🕒 {hour}:{minute}</div>
        </div>

        <div className={styles.cardBody}>
          <h3 className={styles.name}>{displayName}</h3>
          {specialty && <p className={styles.specialty}>{specialty}</p>}
        </div>

        <div className={styles.cardFooter}>
          <span className={`${styles.statusBadge} ${statusInfo.className}`}>
            {statusInfo.label}
          </span>

          {isAppointmentActive && (
            <div className={styles.actions}>
              <button
                className={styles.btnCancel}
                onClick={() => setShowCancelModal(true)}
                disabled={loading}
              >
                Cancelar
              </button>

              {canConclude && (
                <button
                  className={styles.btnConclude}
                  onClick={handleConclude}
                  disabled={loading}
                >
                  {loading ? "..." : "Concluir"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showCancelModal && (
        <CancelModal
          appointmentId={consulta.id}
          newStatus={cancelStatus}
          onClose={() => setShowCancelModal(false)}
          onSuccess={handleCancelSuccess}
        />
      )}
    </>
  );
}