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

const AppointmentList = () => {
  const { user } = useContext(AuthContext);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Filtros
  const [statusFilter, setStatusFilter] = useState("");

  // Abas para médico que também é paciente
  const [activeTab, setActiveTab] = useState("PATIENT");
  const isDoctorAndPatient = user?.roles?.includes("DOCTOR") && user?.roles?.includes("PATIENT");

  useEffect(() => {
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

  if (loading && showSkeleton) {
    return <AppointmentListSkeleton title={pageTitle} />;
  }

  return (
    <div className={styles.appointmentListContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <Button
          className={styles.btnNew}
          onClick={() => toast.info("Funcionalidade de agendamento será implementada em breve!")}
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
                viewMode={activeTab}
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
    </div>
  );
};

export default AppointmentList;