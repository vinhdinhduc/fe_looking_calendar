import axiosInstance from "../../../../utils/axiosInstance";

export const adminCalendarService = {
  getByPlant: async (plantId, params = {}) => {
    const res = await axiosInstance.get(`/admin/calendar/${plantId}`, {
      params,
    });
    return res.data;
  },

  create: async (data) => {
    const res = await axiosInstance.post("/admin/calendar", data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/admin/calendar/${id}`, data);
    return res.data.data;
  },

  remove: async (id) => {
    await axiosInstance.delete(`/admin/calendar/${id}`);
  },
};
