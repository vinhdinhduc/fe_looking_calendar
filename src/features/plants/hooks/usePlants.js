import { useState, useEffect, useCallback } from 'react'
import { plantService } from '../services/plantService'

const usePlants = (initialParams = {}) => {
  const [plants, setPlants]     = useState([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [params, setParams]     = useState(initialParams)

  const fetch = useCallback(async (p = params) => {
    setLoading(true)
    setError(null)
    try {
      const res = await plantService.getAll(p)
      setPlants(res.data || [])
      setTotal(res.meta?.total || 0)
      setPage(res.meta?.page || 1)
      setTotalPages(res.meta?.totalPages || 1)
    } catch (err) {
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch(params) }, [params])

  const updateParams = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: newParams.page || 1 }))
  }

  return { plants, total, page, totalPages, loading, error, params, updateParams, refetch: () => fetch(params) }
}

export default usePlants
