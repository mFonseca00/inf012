import api from "./api";

const userService = {
  getProfile: async () => {
    const response = await api.get("/user/me");
    return response.data;
  },

  forgotPassword: async (username, email) => {
    const response = await api.post("/user/forgot-password", { username, email });
    return response.data;
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    const response = await api.post("/user/reset-password", {
      token,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};

export default userService;