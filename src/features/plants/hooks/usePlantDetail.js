import { useState, useEffect } from 'react'
import { plantService } from '../services/plantService'

const usePlantDetail = (id) => {
  const [plant, setPlant]         = useState(null)
  const [calendar, setCalendar]   = useState([])
  const [stages, setStages]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [plantData, calendarData, stagesData] = await Promise.all([
          plantService.getById(id),
          plantService.getCalendar(id),
          plantService.getCareStages(id),
        ])
        setPlant(plantData)
        setCalendar(calendarData || [])
        setStages(stagesData || [])
      } catch (err) {
        setError(err?.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return { plant, calendar, stages, loading, error }
}

export default usePlantDetail
