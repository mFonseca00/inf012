import React, { useState } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import styles from "./AppointmentCancelModal.module.css";
import appointmentService from "../../../services/appointmentService";

export default function CancelModal({ appointmentId, newStatus, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      toast.warning("Informe o motivo do cancelamento");
      return;
    }

    setLoading(true);
    try {
      await appointmentService.cancelAppointment(appointmentId, reason, newStatus);
      toast.success("Consulta cancelada com sucesso!");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao cancelar consulta");
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={() => !loading && onClose()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Cancelar Consulta</h2>
        <p>Informe o motivo do cancelamento:</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo do cancelamento..."
          rows="5"
          disabled={loading}
        />
        <div className={styles.buttons}>
          <button onClick={onClose} disabled={loading} className={styles.btnSecondary}>
            Voltar
          </button>
          <button onClick={handleConfirm} disabled={loading} className={styles.btnDanger}>
            {loading ? "Cancelando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}