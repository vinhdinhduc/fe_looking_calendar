import axiosInstance from '../../../../utils/axiosInstance'

export const adminUserService = {
  getAll: async (params = {}) => {
    const res = await axiosInstance.get('/admin/users', { params })
    return res.data
  },

  create: async (data) => {
    const res = await axiosInstance.post('/admin/users', data)
    return res.data.data
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/admin/users/${id}`, data)
    return res.data.data
  },

  toggleStatus: async (id) => {
    const res = await axiosInstance.patch(`/admin/users/${id}/toggle-status`)
    return res.data.data
  },

  resetPassword: async (id, newPassword) => {
    const res = await axiosInstance.patch(`/admin/users/${id}/reset-password`, { new_password: newPassword })
    return res.data
  },
}
