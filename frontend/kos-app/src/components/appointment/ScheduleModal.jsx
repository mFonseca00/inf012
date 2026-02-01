import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./ScheduleModal.module.css";
import appointmentService from "../../services/appointmentService";
import doctorService from "../../services/doctorService";
import patientService from "../../services/patientService";
import PatientSelect from "../ui/selectors/PatientSelect";
import DoctorSelect from "../ui/selectors/DoctorSelect";
import DateTimeSelect from "../ui/selectors/DateTimeSelect";

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
  const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("MASTER");

  // Médico pode selecionar paciente (para marcar consulta consigo mesmo)
  // Admin/Master pode selecionar qualquer paciente
  const canSelectPatient = isAdmin || isDoctor;

  // Verifica se o paciente selecionado é o próprio usuário (médico marcando como paciente)
  const isSelectingSelfAsPatient = selectedPatient && 
    user?.patientId && 
    String(selectedPatient) === String(user.patientId);

  // Médico: select de médico fica travado por padrão, só destrava se selecionar a si mesmo como paciente
  const isDoctorSelectLocked = isDoctor && !isAdmin && !isSelectingSelfAsPatient;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const doctorsData = await doctorService.getAll();
        setDoctors(doctorsData.content || []);

        if (canSelectPatient) {
          const patientsData = await patientService.getAll();
          setPatients(patientsData.content || []);
        } else {
          // Paciente comum: usa seu próprio ID
          const myPatient = await patientService.getMyPatientId();
          setSelectedPatient(myPatient.id);
        }
      } catch (error) {
        toast.error("Erro ao carregar dados");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [canSelectPatient]);

  // Filtra médicos e auto-seleciona quando necessário
  useEffect(() => {
    if (!doctors.length) {
      setFilteredDoctors([]);
      return;
    }

    let availableDoctors = [...doctors];

    if (isDoctor && !isAdmin) {
      if (isSelectingSelfAsPatient) {
        // Médico selecionou a si mesmo como paciente: remove ele da lista de médicos
        availableDoctors = doctors.filter(
          (doctor) => String(doctor.id) !== String(user.doctorId)
        );
        // Reseta seleção de médico pois ele não pode se consultar
        setSelectedDoctor("");
      } else {
        // Médico NÃO se selecionou como paciente: só pode marcar consigo mesmo
        availableDoctors = doctors.filter(
          (doctor) => String(doctor.id) === String(user.doctorId)
        );
        // Auto-seleciona o próprio médico
        if (availableDoctors.length === 1) {
          setSelectedDoctor(String(availableDoctors[0].id));
        }
      }
    }

    setFilteredDoctors(availableDoctors);
  }, [doctors, selectedPatient, isDoctor, isAdmin, isSelectingSelfAsPatient, user?.doctorId]);

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
      toast.warning("Consultas devem ser agendadas com antecedência mínima de 30 minutos");
      return false;
    }

    const dayOfWeek = dateTime.getDay();
    if (dayOfWeek === 0) {
      toast.warning("A clínica não funciona aos domingos");
      return false;
    }

    const hour = dateTime.getHours();
    if (hour < 7 || hour >= 19) {
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
        dateTime
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

  // Mensagem de ajuda contextual
  const getDoctorHint = () => {
    if (isDoctor && !isAdmin) {
      if (isSelectingSelfAsPatient) {
        return "Você selecionou a si mesmo como paciente. Escolha outro médico para a consulta.";
      }
      return "Como médico, você só pode marcar consultas de pacientes consigo mesmo.";
    }
    return "Se não selecionar, o sistema escolherá um médico disponível automaticamente.";
  };

  // Verifica se deve mostrar seleção automática
  // Mostra "selecionar automaticamente" para: admin, paciente comum, ou médico se selecionando como paciente
  const showAutoSelect = isAdmin || (!isDoctor && isPatient) || isSelectingSelfAsPatient;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={() => !loading && onClose()}>
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
            <PatientSelect
              canSelectPatient={canSelectPatient}
              patients={patients}
              selectedPatient={selectedPatient}
              setSelectedPatient={setSelectedPatient}
              userName={user?.name}
              disabled={loading}
            />

            <DoctorSelect
              doctors={filteredDoctors}
              selectedDoctor={selectedDoctor}
              setSelectedDoctor={setSelectedDoctor}
              disabled={loading || isDoctorSelectLocked}
              hint={getDoctorHint()}
              showAutoSelect={showAutoSelect}
            />

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
    document.body
  );
}