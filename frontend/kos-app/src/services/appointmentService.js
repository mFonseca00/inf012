import api from "./api";

const appointmentService = {
  getAll: async (page = 0, size = 10, status = "") => {
    let url = `/appointment/all?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    const response = await api.get(url);
    return response.data;
  },
};

export default appointmentService;