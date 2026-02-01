import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./AppointmentList.module.css";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import AppointmentTabs from "../../components/appointment/AppointmentTabs";
import Button from "../../components/ui/button/Button";
import Pagination from "../../components/ui/Pagination";
import StatusFilter from "../../components/ui/selectors/StatusFilter";
import appointmentService from "../../services/appointmentService";
import AppointmentListSkeleton from "../../components/appointment/AppointmentListSkeleton";
import ScheduleModal from "../../components/appointment/ScheduleModal";

const AppointmentList = () => {
  const { user } = useContext(AuthContext);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);

  // Filtros
  const [statusFilter, setStatusFilter] = useState("");

  // Abas para médico que também é paciente
  const isDoctorAndPatient = user?.roles?.includes("DOCTOR") && user?.roles?.includes("PATIENT");
  
  // Define o activeTab inicial baseado na role do usuário
  const getInitialTab = () => {
    if (isDoctorAndPatient) return "PATIENT";
    if (user?.roles?.includes("DOCTOR")) return "DOCTOR";
    return "PATIENT";
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);

  const fetchAppointments = () => {
    setLoading(true);
    setShowSkeleton(false);

    // Define qual role usar baseado na aba ativa ou no perfil do usuário
    let roleParam = null;
    if (isDoctorAndPatient) {
      roleParam = activeTab;
    } else if (user?.roles?.includes("DOCTOR")) {
      roleParam = "DOCTOR";
    } else if (user?.roles?.includes("PATIENT")) {
      roleParam = "PATIENT";
    }

    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(true);
    }, 500);

    appointmentService
      .getMyAppointments(currentPage - 1, itemsPerPage, statusFilter, roleParam)
      .then((data) => {
        setConsultas(data.content || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {
        toast.error("Erro ao buscar agendamentos.");
        setConsultas([]);
        setTotalPages(1);
      })
      .finally(() => {
        clearTimeout(skeletonTimer);
        setLoading(false);
        setShowSkeleton(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, statusFilter, activeTab, isDoctorAndPatient, user?.roles]);

  let pageTitle = "Meus Agendamentos";
  if (user?.roles?.includes("DOCTOR") && !user?.roles?.includes("PATIENT")) {
    pageTitle = "Minha Agenda";
  } else if (user?.roles?.includes("ADMIN") || user?.roles?.includes("MASTER")) {
    pageTitle = "Agendamentos da Clínica";
  }

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  // Determina o viewMode correto para passar ao AppointmentCard
  const getViewMode = () => {
    if (isDoctorAndPatient) return activeTab;
    if (user?.roles?.includes("DOCTOR")) return "DOCTOR";
    return "PATIENT";
  };

  const handleScheduleSuccess = () => {
    fetchAppointments();
  };

  if (loading && showSkeleton) {
    return <AppointmentListSkeleton title={pageTitle} />;
  }

  return (
    <div className={styles.appointmentListContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <Button
          className={styles.btnNew}
          onClick={() => setShowScheduleModal(true)}
        >
          Agendar nova consulta
        </Button>
      </div>

      <AppointmentTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isDoctorAndPatient={isDoctorAndPatient}
      />

      <StatusFilter value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />

      {consultas.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum agendamento encontrado.</p>
        </div>
      ) : (
        <>
          <div className={styles.gridContainer}>
            {consultas.map((consulta) => (
              <AppointmentCard
                key={consulta.id}
                consulta={consulta}
                viewMode={getViewMode()}
                onActionSuccess={fetchAppointments}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {showScheduleModal && (
        <ScheduleModal
          onClose={() => setShowScheduleModal(false)}
          onSuccess={handleScheduleSuccess}
        />
      )}
    </div>
  );
};

export default AppointmentList;