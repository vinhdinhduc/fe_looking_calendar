import axiosInstance from '../../../../utils/axiosInstance'

export const statsService = {
  getDashboard: async () => {
    const res = await axiosInstance.get('/admin/stats/dashboard')
    return res.data.data
  },

  getTopPlants: async (limit = 10) => {
    const res = await axiosInstance.get('/admin/stats/top-plants', { params: { limit } })
    return res.data.data || []
  },

  getTopKeywords: async (limit = 20) => {
    const res = await axiosInstance.get('/admin/stats/top-keywords', { params: { limit } })
    return res.data.data || []
  },

  getSearchActivity: async (days = 30) => {
    const res = await axiosInstance.get('/admin/stats/search-activity', { params: { days } })
    return res.data.data || []
  },

  getPlantsByCategory: async () => {
    const res = await axiosInstance.get('/admin/stats/plants-by-category')
    return res.data.data || []
  },
}
