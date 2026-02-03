import axios from "axios";
import Cookies from "js-cookie";

// API separada para monitoramento - conecta diretamente ao gateway
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
  async getServices() {
    const response = await monitoringApi.get("/monitoring/services");
    return response.data;
  },

  async getServicesDetails() {
    const response = await monitoringApi.get("/monitoring/services/details");
    return response.data;
  },

  async getHealth() {
    const response = await monitoringApi.get("/monitoring/health");
    return response.data;
  },
};

export default monitoringService;
