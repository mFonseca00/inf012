import api from "./api";

const patientService = {
  registerWithUser: async (userData) => {
    const response = await api.post("/patient/register-with-user", userData);
    return response.data;
  },

  getByCpf: async (cpf) => {
    const response = await api.get("/patient", { params: { cpf } });
    return response.data;
  },
};

export default patientService;