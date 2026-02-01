import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./DoctorManager.module.css";
import doctorService from "../../services/doctorService"; // O arquivo que você mostrou
import DoctorForm from "./DoctorForm";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Paginação
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Busca e Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name"); // "name" ou "crm"
  const [isSearching, setIsSearching] = useState(false);

  // Controle de Modal
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Controle de Inativação
  const [showInactivateModal, setShowInactivateModal] = useState(false);
  const [doctorToInactivate, setDoctorToInactivate] = useState(null);

  // Carrega médicos ao iniciar ou mudar página
  useEffect(() => {
    if (!isSearching) {
      fetchDoctors();
    }
  }, [page, isSearching]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getAll({ page, size: pageSize });
      // O Spring Page retorna { content: [], totalPages: ... }
      setDoctors(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.error("Erro ao carregar lista de médicos.");
    } finally {
      setLoading(false);
    }
  };

  // Busca por Nome ou CRM
  const handleSearch = async () => {
    if (!searchTerm) {
        setIsSearching(false);
        setPage(0);
        return;
    }
    
    setLoading(true);
    try {
        if (searchType === "crm") {
            // Busca por CRM - retorna objeto único
            const result = await doctorService.getByCrm(searchTerm);
            if (result) {
                setDoctors([result]);
                setTotalPages(1);
                setIsSearching(true);
            } else {
                toast.warn("Médico não encontrado.");
                setDoctors([]);
            }
        } else {
            // Busca por Nome - retorna paginação
            const data = await doctorService.searchByName(searchTerm, { page: 0, size: pageSize });
            setDoctors(data.content || []);
            setTotalPages(data.totalPages || 0);
            setIsSearching(true);
            setPage(0);
            if (data.content?.length === 0) {
                toast.info("Nenhum médico encontrado com esse nome.");
            }
        }
    } catch (error) {
        toast.error(searchType === "crm" ? "Erro ao buscar médico ou CRM inválido." : "Erro ao buscar médicos.");
    } finally {
        setLoading(false);
    }
  };

  // Busca paginada por nome (quando muda a página durante busca)
  useEffect(() => {
    if (isSearching && searchType === "name" && searchTerm) {
      const searchByNamePaginated = async () => {
        setLoading(true);
        try {
          const data = await doctorService.searchByName(searchTerm, { page, size: pageSize });
          setDoctors(data.content || []);
          setTotalPages(data.totalPages || 0);
        } catch (error) {
          toast.error("Erro ao buscar médicos.");
        } finally {
          setLoading(false);
        }
      };
      searchByNamePaginated();
    }
  }, [page, isSearching, searchType, searchTerm]);

  // --- Ações da Tabela ---

  const handleCreateNew = () => {
    setSelectedDoctor(null);
    setShowForm(true);
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setShowForm(true);
  };

  const handleInactivateClick = (doctor) => {
    setDoctorToInactivate(doctor);
    setShowInactivateModal(true);
  };

  const confirmInactivate = async () => {
    try {
      // Endpoint espera DoctorInactivationDTO, vou mandar o ID ou objeto esperado
      // Assumindo que o DTO exige ID, mas enviaremos o objeto que o service espera
      await doctorService.inactivate({ id: doctorToInactivate.id }); 
      toast.success("Médico inativado com sucesso.");
      fetchDoctors(); // Recarrega lista
    } catch (error) {
      toast.error("Erro ao inativar médico.");
    } finally {
      setShowInactivateModal(false);
      setDoctorToInactivate(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchDoctors();
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        
        {/* Cabeçalho e Busca */}
        <div className={styles.header}>
            <h1 className={styles.title}>Gerenciamento de Médicos</h1>
            
            <div className={styles.searchBox}>
                <select 
                    className={styles.input}
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{width: '120px'}}
                >
                    <option value="name">Nome</option>
                    <option value="crm">CRM</option>
                </select>
                <input 
                    className={styles.input}
                    placeholder={searchType === "crm" ? "Buscar por CRM..." : "Buscar por nome..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch} className={styles.btnPrimary}>Buscar</button>
                {isSearching && (
                    <button 
                        onClick={() => { setSearchTerm(""); setIsSearching(false); setPage(0); }} 
                        className={styles.btnSecondary}
                    >
                        Limpar
                    </button>
                )}
            </div>

            <button onClick={handleCreateNew} className={styles.btnPrimary}>
                + Cadastrar Médico
            </button>
        </div>

        {/* Tabela */}
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CRM</th>
                        <th>Email</th>
                        <th>Especialidade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="5" style={{textAlign: "center"}}>Carregando...</td></tr>
                    ) : doctors.length > 0 ? (
                        doctors.map((doc) => (
                            <tr key={doc.id || doc.crm}>
                                <td>{doc.name}</td>
                                <td>{doc.crm}</td>
                                <td>{doc.email}</td>
                                <td>{doc.speciality}</td>
                                <td>
                                    <button 
                                        className={styles.btnEdit}
                                        onClick={() => handleEdit(doc)}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        className={styles.btnDanger}
                                        onClick={() => handleInactivateClick(doc)}
                                    >
                                        Inativar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" style={{textAlign: "center"}}>Nenhum médico encontrado.</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Paginação */}
        {(!isSearching || (isSearching && searchType === "name")) && totalPages > 0 && (
            <div className={styles.pagination}>
                <button 
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className={styles.btnSecondary}
                >
                    Anterior
                </button>
                <span>Página {page + 1} de {totalPages}</span>
                <button 
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className={styles.btnSecondary}
                >
                    Próxima
                </button>
            </div>
        )}

      </div>

      {/* Modal de Cadastro/Edição */}
      {showForm && (
        <DoctorForm 
            onClose={() => setShowForm(false)} 
            onSuccess={handleFormSuccess}
            initialData={selectedDoctor}
        />
      )}

      {/* Modal de Confirmação de Inativação */}
      {showInactivateModal && (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{maxWidth: '400px', textAlign: 'center'}}>
                <h3>Confirmar Inativação</h3>
                <p>Tem certeza que deseja inativar o médico <strong>{doctorToInactivate?.name}</strong>?</p>
                <div className={styles.modalActions} style={{justifyContent: 'center'}}>
                    <button 
                        onClick={() => setShowInactivateModal(false)}
                        className={styles.btnSecondary}
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={confirmInactivate}
                        className={styles.btnDanger}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default DoctorList;