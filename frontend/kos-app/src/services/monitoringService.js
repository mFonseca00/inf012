import api from "./api";

const monitoringService = {
  /**
   * Lista todos os serviços registrados no Eureka
   * GET /monitoring/services
   */
  async getServices() {
    const response = await api.get("/monitoring/services");
    return response.data;
  },

  /**
   * Retorna informações detalhadas de todos os serviços
   * GET /monitoring/services/details
   */
  async getServicesDetails() {
    const response = await api.get("/monitoring/services/details");
    return response.data;
  },

  /**
   * Verifica o status de saúde dos serviços críticos
   * GET /monitoring/health
   */
  async getHealth() {
    const response = await api.get("/monitoring/health");
    return response.data;
  },
};

export default monitoringService;
