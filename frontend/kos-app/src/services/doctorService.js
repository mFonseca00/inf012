import api from "./api";

const doctorService = {
  register: async (doctorData) => {
    const response = await api.post("/doctor/register", doctorData);
    return response.data;
  },

  update: async (doctorData) => {
    const response = await api.patch("/doctor/update", doctorData);
    return response.data;
  },

  inactivate: async (doctorData) => {
    const response = await api.patch("/doctor/inactivate", doctorData);
    return response.data;
  },

  getAll: async (pageable = { page: 0, size: 10 }) => {
    const response = await api.get("/doctor/all", { params: pageable });
    return response.data;
  },

  searchByName: async (name, pageable = { page: 0, size: 10 }) => {
    const response = await api.get("/doctor/search", { params: { name, ...pageable } });
    return response.data;
  },

  getByCrm: async (crm) => {
    const response = await api.get("/doctor", { params: { crm } });
    return response.data;
  },
};

export default doctorService;
import api from "./api";

const doctorService = {
  getAll: async (page = 0, size = 100) => {
    const response = await api.get(`/doctor/all?page=${page}&size=${size}`);
    return response.data;
  },

  getDoctor: async (crm) => {
    const response = await api.get(`/doctor?crm=${crm}`);
    return response.data;
  },
};

export default doctorService;