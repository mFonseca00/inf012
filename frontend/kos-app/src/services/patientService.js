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

  register: async (patientData) => {
    const response = await api.post("/patient/register", patientData);
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

  getPatientInfo: async (cpf) => {
    const response = await api.get("/patient/info", { params: { cpf } });
    return response.data;
  },

  searchByName: async (name, page = 0, size = 10) => {
    const response = await api.get("/patient/search", { params: { name, page, size } });
    return response.data;
  },

  update: async (patientData) => {
    const response = await api.patch("/patient/update", patientData);
    return response.data;
  },

  inactivate: async (patientData) => {
    const response = await api.patch("/patient/inactivate", patientData);
    return response.data;
  },

  reactivate: async (patientData) => {
    const response = await api.patch("/patient/reactivate", patientData);
    return response.data;
  },
};

export default patientService;