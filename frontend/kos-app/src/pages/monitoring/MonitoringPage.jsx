import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  FiRefreshCw, 
  FiActivity, 
  FiServer, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiCpu 
} from "react-icons/fi";
import styles from "./MonitoringPage.module.css";
import Button from "../../components/ui/button/Button"; 
import monitoringService from "../../services/monitoringService"; 

const MonitoringPage = () => {
  const [healthData, setHealthData] = useState(null);
  const [servicesDetails, setServicesDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async (isManual = false) => {
    setLoading(true);
    try {
      const [health, details] = await Promise.all([
        monitoringService.getHealth(),
        monitoringService.getServicesDetails()
      ]);

      setHealthData(health);
      setServicesDetails(details);
      setLastUpdated(new Date());
      
      if (isManual) {
        toast.success("Status atualizado.");
      }

    } catch (error) {
      console.error("Erro no monitoramento:", error);
      
      if (isManual || !healthData) {
        toast.error("Erro ao comunicar com os serviços.");
      }
      
      if (!healthData) {
        setHealthData(null);
        setServicesDetails({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false); // Carga inicial silenciosa
    const interval = setInterval(() => fetchData(false), 15000); 
    return () => clearInterval(interval);
  }, []);

  // Lógica para decidir a cor do Card (Verde/Vermelho)
  const getServiceStatus = (serviceName, instances) => {
    const healthKey = `${serviceName}-service`;
    
    if (healthData && healthData[healthKey]) {
      return healthData[healthKey].status === 'UP';
    }
    
    return instances && instances.length > 0;
  };

  return (
    <div className={styles.container}>    
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Painel de Serviços</h1>
          <p className={styles.subtitle}>Monitoramento em tempo real (Eureka Discovery)</p>
        </div>
        
        <div className={styles.headerActions}>
            {lastUpdated && (
                <span className={styles.lastUpdate}>
                    Atualizado às {lastUpdated.toLocaleTimeString()}
                </span>
            )}
            <Button 
                onClick={() => fetchData(true)} 
                disabled={loading} 
                className={styles.refreshBtn}
            >
                <FiRefreshCw 
                    className={loading ? styles.spin : ''} 
                    style={{ marginRight: 8 }} 
                />
                {loading ? "Carregando..." : "Atualizar"}
            </Button>
        </div>
      </div>

      {healthData && (
        <div className={`${styles.systemBanner} ${healthData.overall_status === 'HEALTHY' ? styles.bannerOk : styles.bannerError}`}>
            <div className={styles.bannerIcon}>
                {healthData.overall_status === 'HEALTHY' 
                    ? <FiCheckCircle size={24}/> 
                    : <FiAlertCircle size={24}/>
                }
            </div>
            <div>
                <h3 className={styles.bannerTitle}>
                    {healthData.overall_status === 'HEALTHY' 
                        ? 'Sistema Saudável' 
                        : 'Sistema Degradado'
                    }
                </h3>
                <span className={styles.bannerDesc}>
                    {healthData.overall_status === 'HEALTHY' 
                        ? 'Todos os serviços críticos estão operando normalmente.' 
                        : 'Atenção: Um ou mais serviços essenciais estão indisponíveis.'}
                </span>
            </div>
        </div>
      )}

      {loading && !healthData ? (
        <div className={styles.loadingState}>
            <FiRefreshCw className={styles.spin} size={32} style={{marginBottom: 10, color: '#0056b3'}}/>
            <p>Obtendo dados do Service Registry...</p>
        </div>
      ) : Object.keys(servicesDetails).length === 0 ? (
        <div className={styles.emptyState}>
            <FiAlertCircle size={48} color="#999" style={{marginBottom: 16}} />
            <h3>Nenhum serviço detectado</h3>
            <p>Não foi possível recuperar a lista de serviços do backend.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {Object.entries(servicesDetails).map(([serviceName, instances]) => {
            const isUp = getServiceStatus(serviceName, instances);
            
            return (
              <div key={serviceName} className={`${styles.card} ${isUp ? '' : styles.cardDown}`}>
                <div className={styles.cardHeader}>
                  <div className={`${styles.iconBox} ${isUp ? styles.iconBoxUp : styles.iconBoxDown}`}>
                    <FiServer size={22} color={isUp ? "#0056b3" : "#c53030"} />
                  </div>
                  <div className={styles.cardTitleWrapper}>
                    <h3 className={styles.serviceName}>{serviceName.toUpperCase()}</h3>
                    <span className={`${styles.statusBadge} ${isUp ? styles.badgeUp : styles.badgeDown}`}>
                        {isUp ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.metric}>
                    <FiCpu size={16} />
                    <span>Instâncias Ativas: <strong>{instances.length}</strong></span>
                  </div>

                  <div className={styles.instanceList}>
                     {instances.length > 0 ? (
                        instances.map((inst, idx) => (
                            <div key={idx} className={styles.instanceItem}>
                                <div className={styles.led} />
                                <span title={inst.uri}>{inst.host}:{inst.port}</span>
                            </div>
                        ))
                     ) : (
                        <span className={styles.noInstances}>
                            <FiActivity style={{marginRight:5}}/>
                            Sem instâncias
                        </span>
                     )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MonitoringPage;