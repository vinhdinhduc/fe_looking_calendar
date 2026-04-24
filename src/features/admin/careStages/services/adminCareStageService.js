import axiosInstance from "../../../../utils/axiosInstance";

export const adminCareStageService = {
  getByPlant: async (plantId, params = {}) => {
    const res = await axiosInstance.get(`/admin/care-stages/${plantId}`, {
      params,
    });
    return res.data;
  },

  create: async (data) => {
    const res = await axiosInstance.post("/admin/care-stages", data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/admin/care-stages/${id}`, data);
    return res.data.data;
  },

  remove: async (id) => {
    await axiosInstance.delete(`/admin/care-stages/${id}`);
  },

  addImage: async (stageId, formData) => {
    const res = await axiosInstance.post(
      `/admin/care-stages/${stageId}/images`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data.data;
  },

  removeImage: async (imageId) => {
    await axiosInstance.delete(`/admin/care-stages/images/${imageId}`);
  },
};
