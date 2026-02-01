import api from "./api";

const appointmentService = {
  getMyAppointments: async (page = 0, size = 10, status = "", role = null) => {
    let url = `/appointment/my-appointments?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    if (role) url += `&role=${role}`;
    const response = await api.get(url);
    return response.data;
  },

  getAll: async (page = 0, size = 10, status = "") => {
    let url = `/appointment/all?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    const response = await api.get(url);
    return response.data;
  },

  cancelAppointment: async (appointmentId, reason, newStatus) => {
    const response = await api.patch("/appointment/cancel", {
      appointmentId,
      reason,
      newStatus,
    });
    return response.data;
  },

  concludeAppointment: async (appointmentId) => {
    const response = await api.patch("/appointment/conclude", {
      appointmentId,
    });
    return response.data;
  },
};

export default appointmentService;