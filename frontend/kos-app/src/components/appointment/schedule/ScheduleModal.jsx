import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../../contexts/AuthContext";
import styles from "./ScheduleModal.module.css";
import appointmentService from "../../../services/appointmentService";
import doctorService from "../../../services/doctorService";
import patientService from "../../../services/patientService";
import AutocompleteSelect from "../../ui/selectors/AutocompleteSelect";

export default function ScheduleModal({ onClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const customStyles = `
    .native-input-picker { position: relative; }
    .native-input-picker::-webkit-calendar-picker-indicator {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      width: 100%; height: 100%; opacity: 0; cursor: pointer;
    }
  `;

  const isDoctor = user?.roles?.includes("DOCTOR");
  const isPatient = user?.roles?.includes("PATIENT");
  const isAdmin =
    user?.roles?.includes("ADMIN") || user?.roles?.includes("MASTER");
  const canSelectPatient = isAdmin || isDoctor;
  const isSelectingSelfAsPatient =
    selectedPatient &&
    user?.patientId &&
    String(selectedPatient) === String(user.patientId);
  const isDoctorSelectLocked =
    isDoctor && !isAdmin && !isSelectingSelfAsPatient;
  const showAutoSelect =
    isAdmin || (!isDoctor && isPatient) || isSelectingSelfAsPatient;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const doctorsData = await doctorService.getAll();
        const activeDoctors = (doctorsData.content || []).filter(
          (d) => d.isActive,
        );
        setDoctors(activeDoctors);

        if (canSelectPatient) {
          const patientsData = await patientService.getAll();
          const activePatients = (patientsData.content || []).filter(
            (p) => p.isActive,
          );
          setPatients(activePatients);
        } else {
          const myPatientId = await patientService.getMyPatientId();
          setSelectedPatient(myPatientId);
        }
      } catch (error) {
        toast.error("Erro ao carregar dados");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [canSelectPatient]);

  useEffect(() => {
    if (!doctors.length) {
      setFilteredDoctors([]);
      return;
    }
    let availableDoctors = [...doctors];
    if (isDoctor && !isAdmin) {
      if (isSelectingSelfAsPatient) {
        availableDoctors = doctors.filter(
          (d) => String(d.id) !== String(user.doctorId),
        );
        setSelectedDoctor("");
      } else {
        availableDoctors = doctors.filter(
          (d) => String(d.id) === String(user.doctorId),
        );
        if (availableDoctors.length === 1)
          setSelectedDoctor(String(availableDoctors[0].id));
      }
    }
    setFilteredDoctors(availableDoctors);
  }, [
    doctors,
    selectedPatient,
    isDoctor,
    isAdmin,
    isSelectingSelfAsPatient,
    user?.doctorId,
  ]);

  const validateForm = () => {
    if (!selectedPatient) {
      toast.warning("Selecione um paciente");
      return false;
    }
    if (!appointmentDate) {
      toast.warning("Selecione uma data");
      return false;
    }
    if (!appointmentTime) {
      toast.warning("Selecione um horário");
      return false;
    }

    if (!showAutoSelect && !selectedDoctor) {
      toast.warning("Selecione um médico");
      return false;
    }

    const dateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const now = new Date();
    const minTime = new Date(now.getTime() + 30 * 60000); // 30 min antecedência

    if (dateTime < minTime) {
      toast.warning("Antecedência mínima de 30 minutos necessária.");
      return false;
    }
    if (dateTime.getDay() === 0) {
      toast.warning("Domingo fechado.");
      return false;
    }
    const hour = dateTime.getHours();
    if (hour < 7 || hour >= 19) {
      toast.warning("Funcionamento: 07:00 às 19:00");
      return false;
    }
    return true;
  };

  const checkAvailabilityConflict = (existingDateStr, newDateObj) => {
    const existingTime = new Date(existingDateStr).getTime();
    const newTime = newDateObj.getTime();

    const diffInMs = Math.abs(newTime - existingTime);
    const diffInMinutes = diffInMs / (1000 * 60);

    return diffInMinutes < 60;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dateTimeStr = `${appointmentDate}T${appointmentTime}:00`;
      const desiredDateObj = new Date(dateTimeStr);
      let finalDoctorId = selectedDoctor;

      if (!finalDoctorId && filteredDoctors.length > 0) {
        let existingAppointments = [];
        try {
          const response =
            await appointmentService.getAppointmentsByDate(appointmentDate);
          existingAppointments = response.content || response || [];
        } catch (err) {
          console.warn(
            "Não foi possível verificar agenda do dia. Sorteio será cego.",
            err,
          );
        }

        const availableCandidates = filteredDoctors.filter((doc) => {
          // Pega todas as consultas desse médico específico no dia
          const doctorAppointments = existingAppointments.filter(
            (appt) =>
              String(appt.doctorId) === String(doc.id) &&
              appt.status !== "CANCELED",
          );

          const hasConflict = doctorAppointments.some((appt) =>
            checkAvailabilityConflict(appt.dateTime, desiredDateObj),
          );

          return !hasConflict;
        });

        if (availableCandidates.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * availableCandidates.length,
          );
          finalDoctorId = availableCandidates[randomIndex].id;
        } else {
          toast.warning(
            "Nenhum médico disponível neste horário (todos ocupados). Tente outro horário.",
          );
          setLoading(false);
          return; 
        }
      }
      
      await appointmentService.scheduleAppointment(
        selectedPatient,
        finalDoctorId,
        dateTimeStr,
      );

      toast.success("Consulta agendada com sucesso!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      let errorMsg = "Erro ao agendar";
      const data = error.response?.data;
      if (typeof data === "string") errorMsg = data;
      else if (data?.message) errorMsg = data.message;
      else if (error.message) errorMsg = error.message;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputClick = (e) => {
    if (e.target.showPicker) e.target.showPicker();
  };

  const rowStyle = { display: "flex", gap: "15px", marginTop: "10px" };
  const colStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  };

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={() => !loading && onClose()}>
      <style>{customStyles}</style>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Agendar Consulta</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {loadingData ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <div className={styles.body}>
            {canSelectPatient ? (
              <div className={styles.field}>
                <label>Paciente *</label>
                <AutocompleteSelect
                  items={patients}
                  selectedItem={selectedPatient}
                  setSelectedItem={setSelectedPatient}
                  disabled={loading}
                  placeholder="Nome do paciente..."
                  labelKey="name"
                  valueKey="id"
                />
              </div>
            ) : (
              <div className={styles.field}>
                <label>Paciente</label>
                <input
                  type="text"
                  value={user?.name || "Você"}
                  disabled
                  className={styles.input}
                />
              </div>
            )}

            <div className={styles.field}>
              <label>Médico {showAutoSelect ? "(opcional)" : "*"}</label>
              <AutocompleteSelect
                items={filteredDoctors}
                selectedItem={selectedDoctor}
                setSelectedItem={setSelectedDoctor}
                disabled={loading || isDoctorSelectLocked}
                placeholder="Busque por nome ou especialidade..."
                labelKey="name"
                valueKey="id"
              />
              {showAutoSelect && (
                <small className={styles.hint} style={{ color: "#666" }}>
                  Se deixar em branco, buscaremos um médico livre neste horário.
                </small>
              )}
            </div>

            <div style={rowStyle}>
              <div style={colStyle}>
                <label style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                  Data *
                </label>
                <input
                  type="date"
                  className={`${styles.input} native-input-picker`}
                  value={appointmentDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  onClick={handleInputClick}
                  disabled={loading}
                />
              </div>
              <div style={colStyle}>
                <label style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                  Horário *
                </label>
                <input
                  type="time"
                  className={`${styles.input} native-input-picker`}
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  onClick={handleInputClick}
                  disabled={loading}
                />
              </div>
            </div>
            <div
              style={{ marginTop: "5px", fontSize: "0.75rem", color: "#666" }}
            >
              Horário de funcionamento: 07:00 às 19:00 (Seg a Sáb)
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <button
            className={styles.btnSecondary}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={loading || loadingData}
          >
            {loading ? "Verificando agenda..." : "Agendar Consulta"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
