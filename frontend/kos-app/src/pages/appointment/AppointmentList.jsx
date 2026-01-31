import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./AppointmentList.module.css";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import Button from "../../components/ui/button/Button";
import Pagination from "../../components/ui/Pagination";
import StatusFilter from "../../components/ui/selectors/StatusFilter";
import { useNavigate } from "react-router-dom";
import appointmentService from "../../services/appointmentService";
import AppointmentListSkeleton from "../../components/appointment/AppointmentListSkeleton";


const AppointmentList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Filtro
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    appointmentService
      .getAll(currentPage - 1, itemsPerPage, statusFilter)
      .then((data) => {
        setConsultas(data.content || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {
        toast.error("Erro ao buscar agendamentos.");
        setConsultas([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [currentPage, itemsPerPage, statusFilter]);

  let pageTitle = "Meus Agendamentos";
  if (user?.roles?.includes("DOCTOR")) {
    pageTitle = "Minha Agenda";
  } else if (user?.roles?.includes("ADMIN") || user?.roles?.includes("MASTER")) {
    pageTitle = "Agendamentos da Clínica";
  }

  if (loading) {
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