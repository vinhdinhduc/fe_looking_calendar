import axiosInstance from '../../../utils/axiosInstance'

export const categoryService = {
  getActiveWithCount: async () => {
    const res = await axiosInstance.get('/categories')
    return res.data.data || []
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/categories/${id}`)
    return res.data.data
  },
}
