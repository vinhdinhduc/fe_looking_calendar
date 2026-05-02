import axiosInstance from "../../../../utils/axiosInstance";

export const adminContactService = {
  getAll: async (params = {}) => {
    const res = await axiosInstance.get("/admin/contacts", { params });
    return res.data;
  },

  assign: async (id, assignedTo) => {
    const res = await axiosInstance.patch(`/admin/contacts/${id}/assign`, {
      assigned_to: assignedTo,
    });
    return res.data.data;
  },
};
