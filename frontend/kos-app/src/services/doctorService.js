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