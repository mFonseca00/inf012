import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import MainLayout from "../../components/layout/MainLayout"; 
import styles from "./AppointmentList.module.css";
import AppointmentCard from "../../components/appointment/AppointmentCard";

const AppointmentList = () => {
  const { user } = useContext(AuthContext);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulando busca de dados na API
  useEffect(() => {
    // Aqui futuramente entrará sua chamada: api.get('/appointments')
    setTimeout(() => {
      setConsultas([
        {
          id: 1,
          medico: "Dr. André Martins",
          especialidade: "Cardiologia",
          data: "30/01/2026",
          hora: "14:00",
          status: "CONFIRMED",
        },
        {
          id: 2,
          medico: "Dra. Juliana Costa",
          especialidade: "Dermatologia",
          data: "05/02/2026",
          hora: "09:30",
          status: "PENDING",
        },
        {
          id: 3,
          medico: "Dr. Roberto Campos",
          especialidade: "Ortopedia",
          data: "10/02/2026",
          hora: "16:00",
          status: "CANCELED",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED": return styles.statusConfirmed;
      case "PENDING": return styles.statusPending;
      case "CANCELED": return styles.statusCanceled;
      default: return "";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "CONFIRMED": return "Confirmado";
      case "PENDING": return "Pendente";
      case "CANCELED": return "Cancelado";
      default: return status;
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h2>Meus Agendamentos</h2>
            <p className={styles.subtitle}>Gerencie suas consultas médicas</p>
          </div>
          <Link to="/nova-consulta" className={styles.btnNew}>
            + Novo Agendamento
          </Link>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Carregando agendamentos...</div>
        ) : (
          <div className={styles.gridContainer}>
            {consultas.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Você não possui agendamentos futuros.</p>
              </div>
            ) : (
              consultas.map((consulta) => (
                <AppointmentCard
                  key={consulta.id}
                  consulta={consulta}
                  getStatusStyle={getStatusStyle}
                  getStatusLabel={getStatusLabel}
                />
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AppointmentList;