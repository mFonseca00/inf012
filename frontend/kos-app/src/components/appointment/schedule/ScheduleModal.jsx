import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../../contexts/AuthContext";
import styles from "./ScheduleModal.module.css";
import appointmentService from "../../../services/appointmentService";
import doctorService from "../../../services/doctorService";
import patientService from "../../../services/patientService";
import AutocompleteSelect from "../../ui/selectors/AutocompleteSelect";
import DateTimeSelect from "../../ui/selectors/DateTimeSelect";

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

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const doctorsData = await doctorService.getAll();
        setDoctors(doctorsData.content || []);

        if (canSelectPatient) {
          const patientsData = await patientService.getAll();

          // Garante que é um array
          const allPatients = patientsData.content || [];

          // FILTRAGEM CORRETA:
          // Baseado no seu PatientRow, isActive é uma propriedade (true/false), não função.
          const activePatients = allPatients.filter(
            (patient) => patient.isActive === true,
          );

          setPatients(activePatients);
        } else {
          const myPatientId = await patientService.getMyPatientId();
          setSelectedPatient(myPatientId);
        }
      } catch (error) {
        console.error(error); // Bom para ver o erro real no console
        toast.error("Erro ao carregar dados");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [canSelectPatient]);

  // Filtra médicos quando necessário
  useEffect(() => {
    if (!doctors.length) {
      setFilteredDoctors([]);
      return;
    }

    let availableDoctors = [...doctors];

    if (isDoctor && !isAdmin) {
      if (isSelectingSelfAsPatient) {
        availableDoctors = doctors.filter(
          (doctor) => String(doctor.id) !== String(user.doctorId),
        );
        setSelectedDoctor("");
      } else {
        availableDoctors = doctors.filter(
          (doctor) => String(doctor.id) === String(user.doctorId),
        );
        if (availableDoctors.length === 1) {
          setSelectedDoctor(String(availableDoctors[0].id));
        }
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

    const dateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const now = new Date();
    const minTime = new Date(now.getTime() + 30 * 60000);

    if (dateTime < minTime) {
      toast.warning(
        "Consultas devem ser agendadas com antecedência mínima de 30 minutos",
      );
      return false;
    }

    const dayOfWeek = dateTime.getDay();
    if (dayOfWeek === 0) {
      toast.warning("A clínica não funciona aos domingos");
      return false;
    }

    const openingTime = new Date(dateTime);
    openingTime.setHours(7, 0, 0, 0);

    const closingTime = new Date(dateTime);
    closingTime.setHours(19, 0, 0, 0);

    const endTime = new Date(dateTime.getTime() + 60 * 60000);

    if (dateTime < openingTime || endTime > closingTime) {
      toast.warning("Horário de funcionamento: 07:00 às 19:00");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dateTime = `${appointmentDate}T${appointmentTime}:00`;

      await appointmentService.scheduleAppointment(
        selectedPatient,
        selectedDoctor || null,
        dateTime,
      );

      toast.success("Consulta agendada com sucesso!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      let errorMsg = "Erro ao agendar consulta";
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === "string") {
          errorMsg = data;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (typeof data === "object") {
          errorMsg = JSON.stringify(data);
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorHint = () => {
    if (isDoctor && !isAdmin) {
      if (isSelectingSelfAsPatient) {
        return "Você selecionou a si mesmo como paciente. Escolha outro médico para a consulta.";
      }
      return "Como médico, você só pode marcar consultas de pacientes consigo mesmo.";
    }
    return "Caso não seja selecionado, escolheremos um médico disponível automaticamente.";
  };

  const showAutoSelect =
    isAdmin || (!isDoctor && isPatient) || isSelectingSelfAsPatient;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={() => !loading && onClose()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Agendar Consulta</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            ✕
          </button>
        </div>

        {loadingData ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <div className={styles.body}>
            {canSelectPatient && (
              <div className={styles.field}>
                <label>Paciente *</label>
                <AutocompleteSelect
                  items={patients}
                  selectedItem={selectedPatient}
                  setSelectedItem={setSelectedPatient}
                  disabled={loading}
                  placeholder="Digite o nome do paciente..."
                  labelKey="name"
                  valueKey="id"
                />
              </div>
            )}

            {!canSelectPatient && (
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
                placeholder="Digite o nome do médico ou especialidade..."
                labelKey="name"
                valueKey="id"
              />
              {getDoctorHint() && (
                <small className={styles.hint}>{getDoctorHint()}</small>
              )}
            </div>

            <DateTimeSelect
              appointmentDate={appointmentDate}
              setAppointmentDate={setAppointmentDate}
              appointmentTime={appointmentTime}
              setAppointmentTime={setAppointmentTime}
              disabled={loading}
            />
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
            {loading ? "Agendando..." : "Agendar Consulta"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
