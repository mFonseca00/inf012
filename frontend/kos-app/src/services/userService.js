import api from "./api";

const userService = {
  getProfile: async () => {
    const response = await api.get("/user/me");
    return response.data;
  },
};

export default userService;