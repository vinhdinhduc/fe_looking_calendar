import axiosInstance from '../../../utils/axiosInstance'

export const plantService = {
  getAll: async (params = {}) => {
    const res = await axiosInstance.get('/plants', { params })
    return res.data
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/plants/${id}`)
    return res.data.data
  },

  getSuggestions: async (month) => {
    const res = await axiosInstance.get('/plants/suggestions', { params: { month } })
    return res.data.data
  },

  getCalendar: async (plantId) => {
    const res = await axiosInstance.get(`/plants/${plantId}/calendar`)
    return res.data.data
  },

  getCareStages: async (plantId) => {
    const res = await axiosInstance.get(`/plants/${plantId}/care-stages`)
    return res.data.data
  },

  getCareStageById: async (id) => {
    const res = await axiosInstance.get(`/care-stages/${id}`)
    return res.data.data
  },
}
