import axiosInstance from "../../../utils/axiosInstance";

export const authService = {
  login: async (username, password) => {
    const res = await axiosInstance.post("/auth/login", { username, password });
    return res.data.data;
  },

  forgotPassword: async (email) => {
    const res = await axiosInstance.post("/auth/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    const res = await axiosInstance.post("/auth/reset-password", {
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return res.data;
  },

  refreshToken: async (refreshToken) => {
    const res = await axiosInstance.post("/auth/refresh-token", {
      refreshToken,
    });
    return res.data.data;
  },

  getMe: async () => {
    const res = await axiosInstance.get("/auth/me");
    return res.data.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const res = await axiosInstance.put("/auth/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return res.data;
  },

  logout: async () => {
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
  },
};
