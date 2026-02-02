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

  reactivate: async (doctorData) => {
    const response = await api.patch("/doctor/reactivate", doctorData);
    return response.data;
  },

  getAll: async (pageable = { page: 0, size: 10 }) => {
    const response = await api.get("/doctor/all", { params: pageable });
    return response.data;
  },

  searchByName: async (name, pageable = { page: 0, size: 10 }) => {
    const response = await api.get("/doctor/search", {
      params: { name, ...pageable },
    });
    return response.data;
  },

  getDoctorInfo: async (crm) => {
    const response = await api.get("/doctor/info", { params: { crm } });
    return response.data;
  },

  getByCrm: async (crm) => {
    const response = await api.get("/doctor", { params: { crm } });
    return response.data;
  },

  getByUsername: async (username) => {
    try {
      const response = await api.get(`/doctor/info/${username}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar médico por username:", error);
      return null;
    }
  },
};

export default doctorService;
