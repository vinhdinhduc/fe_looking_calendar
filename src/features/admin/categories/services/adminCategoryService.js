import axiosInstance from "../../../../utils/axiosInstance";

export const adminCategoryService = {
  getAll: async (params = {}) => {
    const res = await axiosInstance.get("/admin/categories", { params });
    return res.data;
  },

  create: async (data) => {
    const res = await axiosInstance.post("/admin/categories", data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/admin/categories/${id}`, data);
    return res.data.data;
  },

  remove: async (id) => {
    await axiosInstance.delete(`/admin/categories/${id}`);
  },
};
