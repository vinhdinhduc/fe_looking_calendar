import axiosInstance from '../../../../utils/axiosInstance'

export const adminFaqService = {
  getAll: async (params = {}) => {
    const res = await axiosInstance.get('/admin/faqs', { params })
    return res.data
  },

  create: async (data) => {
    const res = await axiosInstance.post('/admin/faqs', data)
    return res.data.data
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/admin/faqs/${id}`, data)
    return res.data.data
  },

  remove: async (id) => {
    await axiosInstance.delete(`/admin/faqs/${id}`)
  },
}
