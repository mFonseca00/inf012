import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./DoctorList.module.css";
import DoctorRow from "../../components/doctor/row/DoctorRow";
import Button from "../../components/ui/button/Button";
import Pagination from "../../components/ui/Pagination";
import doctorService from "../../services/doctorService";
import DoctorListSkeleton from "../../components/doctor/skeleton/DoctorListSkeleton";
import DoctorForm from "../../components/doctor/form/DoctorForm";

const DoctorList = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchDoctors = () => {
    setLoading(true);
    setShowSkeleton(false);

    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(true);
    }, 500);

    const request = searchTerm 
      ? doctorService.searchByName(searchTerm, currentPage - 1, itemsPerPage)
      : doctorService.getAll(currentPage - 1, itemsPerPage);

    request
      .then((data) => {
        setDoctors(data.content || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {
        toast.error("Erro ao buscar médicos.");
        setDoctors([]);
        setTotalPages(1);
      })
      .finally(() => {
        clearTimeout(skeletonTimer);
        setLoading(false);
        setShowSkeleton(false);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleActionSuccess = () => {
    fetchDoctors();
  };

  const handleAddButtonClick = () => {
    console.log("Botão clicado, abrindo modal"); // Debug
    setShowDoctorForm(true);
  };

  if (loading && showSkeleton) {
    return <DoctorListSkeleton title="Gerenciamento de Médicos" />;
  }

  return (
    <div className={styles.doctorListContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Gerenciamento de Médicos</h1>
        <Button className={styles.btnNew} onClick={handleAddButtonClick}>
          Cadastrar médico
        </Button>
      </div>
      <div className={styles.searchBarWrapper}>
        <label className={styles.searchLabel} htmlFor="doctorSearch">Buscar:</label>
        <input
          id="doctorSearch"
          type="text"
          placeholder="Buscar médico por nome..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Nome</div>
          <div className={styles.headerCell}>Email</div>
          <div className={styles.headerCell}>CRM</div>
          <div className={styles.headerCell}>Especialidade</div>
          <div className={styles.headerCell}>Status</div>
          <div className={styles.headerCell}>Ações</div>
        </div>

        {doctors.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum médico encontrado.</p>
          </div>
        ) : (
          <div className={styles.tableBody}>
            {doctors.map((doctor) => (
              <DoctorRow
                key={doctor.id}
                doctor={doctor}
                onActionSuccess={handleActionSuccess}
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

      {showDoctorForm && (
        <DoctorForm
          onClose={() => setShowDoctorForm(false)}
          onSuccess={() => {
            setShowDoctorForm(false);
            fetchDoctors();
          }}
        />
      )}
    </div>
  );
};

export default DoctorList;