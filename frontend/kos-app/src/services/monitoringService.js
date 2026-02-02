import axios from "axios";
import Cookies from "js-cookie";

// API separada para monitoramento - conecta diretamente ao gateway
// Isso garante que o monitoramento funcione mesmo quando clinic está down
const monitoringApi = axios.create({
  baseURL: "http://localhost:8090",
});

monitoringApi.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const monitoringService = {
  /**
   * Lista todos os serviços registrados no Eureka
   * GET /monitoring/services
   */
  async getServices() {
    const response = await monitoringApi.get("/monitoring/services");
    return response.data;
  },

  /**
   * Retorna informações detalhadas de todos os serviços
   * GET /monitoring/services/details
   */
  async getServicesDetails() {
    const response = await monitoringApi.get("/monitoring/services/details");
    return response.data;
  },

  /**
   * Verifica o status de saúde dos serviços críticos
   * GET /monitoring/health
   */
  async getHealth() {
    const response = await monitoringApi.get("/monitoring/health");
    return response.data;
  },
};

export default monitoringService;
