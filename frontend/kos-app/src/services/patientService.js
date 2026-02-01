import api from "./api";

const patientService = {
  getAll: async (page = 0, size = 100) => {
    const response = await api.get(`/patient/all?page=${page}&size=${size}`);
    return response.data;
  },

  getPatient: async (cpf) => {
    const response = await api.get(`/patient?cpf=${cpf}`);
    return response.data;
  },

  getMyPatient: async () => {
    const response = await api.get("/patient/me");
    return response.data;
  },

  getMyPatientId: async () => {
    const response = await api.get("/patient/me");
    return response.data.id;
  },

  registerWithUser: async (data) => {
    const response = await api.post("/patient/register-with-user", data);
    return response.data;
  },

  getByCpf: async (cpf) => {
    const response = await api.get("/patient", { params: { cpf } });
    return response.data;
  },

  getByUsername: async (username) => {
    try {
      const response = await api.get(`/patient/info/${username}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar paciente por username:", error);
      return null;
    }
  },

  update: async (patientData) => {
    const response = await api.patch("/patient/update", patientData);
    return response.data;
  },
};

export default patientService;