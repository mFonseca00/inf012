import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8090/clinic",
  withCredentials: true, // OBRIGATÓRIO: Envia os cookies automaticamente nas requisições
});

export default api;
