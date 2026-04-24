import axiosInstance from '../../../utils/axiosInstance'

export const faqService = {
  getAll: async (params = {}) => {
    const res = await axiosInstance.get('/faqs', { params })
    return res.data
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/faqs/${id}`)
    return res.data.data
  },
}
