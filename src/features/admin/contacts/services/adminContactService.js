import axiosInstance from "../../../../utils/axiosInstance";

export const adminContactService = {
  getAll: async (params = {}) => {
    const res = await axiosInstance.get("/admin/contacts", { params });
    return res.data;
  },
};
