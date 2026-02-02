import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./PatientList.module.css";
import PatientRow from "../../components/patient/row/PatientRow";
import Button from "../../components/ui/button/Button";
import Pagination from "../../components/ui/Pagination";
import PatientForm from "../../components/patient/form/PatientForm";
import patientService from "../../services/patientService";
import PatientListSkeleton from "../../components/patient/skeleton/PatientListSkeleton";

const PatientList = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialData, setInitialData] = useState(null);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchPatients = () => {
    setLoading(true);
    setShowSkeleton(false);

    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(true);
    }, 500);

    const request = searchTerm 
      ? patientService.searchByName(searchTerm, currentPage - 1, itemsPerPage)
      : patientService.getAll(currentPage - 1, itemsPerPage);

    request
      .then((data) => {
        setPatients(data.content || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {
        toast.error("Erro ao buscar pacientes.");
        setPatients([]);
        setTotalPages(1);
      })
      .finally(() => {
        clearTimeout(skeletonTimer);
        setLoading(false);
        setShowSkeleton(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddButtonClick = () => {
    setInitialData(null);
    setShowPatientForm(true);
  };

  const handleEdit = (patient) => {
    setInitialData(patient);
    setShowPatientForm(true);
  };

  const handleActionSuccess = () => {
    fetchPatients();
  };

  const handleCloseForm = () => {
    setShowPatientForm(false);
    setInitialData(null);
  };

  if (loading && showSkeleton) {
    return <PatientListSkeleton title="Gerenciamento de Pacientes" />;
  }

  return (
    <div className={styles.patientListContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Gerenciamento de Pacientes</h1>
        <Button className={styles.btnNew} onClick={handleAddButtonClick}>
          Cadastrar paciente
        </Button>
      </div>

      <div className={styles.searchBarWrapper}>
        <label className={styles.searchLabel} htmlFor="patientSearch">Buscar:</label>
        <input
          id="patientSearch"
          type="text"
          placeholder="Buscar paciente por nome..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Nome</div>
          <div className={styles.headerCell}>Email</div>
          <div className={styles.headerCell}>CPF</div>          
          <div className={styles.headerCell}>Status</div>
          <div className={styles.headerCell}>Ações</div>
        </div>

        {patients.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum paciente encontrado.</p>
          </div>
        ) : (
          <div className={styles.tableBody}>
            {patients.map((patient) => (
              <PatientRow
                key={patient.id}
                patient={patient}
                onActionSuccess={handleActionSuccess}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {showPatientForm && (
        <PatientForm
          onClose={handleCloseForm}
          onSuccess={() => {
            handleCloseForm();
            fetchPatients();
          }}
          initialData={initialData}
        />
      )}
    </div>
  );
};

export default PatientList;
