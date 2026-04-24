import axiosInstance from '../../../../utils/axiosInstance'

export const adminPlantService = {
  getAll: async (params = {}) => {
    const res = await axiosInstance.get('/admin/plants', { params })
    return res.data
  },

  create: async (formData) => {
    const res = await axiosInstance.post('/admin/plants', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  update: async (id, formData) => {
    const res = await axiosInstance.put(`/admin/plants/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  remove: async (id) => {
    await axiosInstance.delete(`/admin/plants/${id}`)
  },
}
