import { useState, useEffect } from 'react'
import { statsService } from '../services/statsService'

const useStats = () => {
  const [dashboard, setDashboard]     = useState(null)
  const [topPlants, setTopPlants]     = useState([])
  const [topKeywords, setTopKeywords] = useState([])
  const [activity, setActivity]       = useState([])
  const [byCategory, setByCategory]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [d, tp, tk, act, cat] = await Promise.all([
          statsService.getDashboard(),
          statsService.getTopPlants(8),
          statsService.getTopKeywords(12),
          statsService.getSearchActivity(30),
          statsService.getPlantsByCategory(),
        ])
        setDashboard(d)
        setTopPlants(tp)
        setTopKeywords(tk)
        setActivity(act)
        setByCategory(cat)
      } catch (err) {
        setError(err?.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { dashboard, topPlants, topKeywords, activity, byCategory, loading, error }
}

export default useStats
