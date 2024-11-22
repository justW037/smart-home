import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function useDaysLogic() {
  const [selectedDays, setSelectedDays] = useState([])
  const { t } = useTranslation()

  const dayMapping = {
    [t('days.Sun')]: 0,
    [t('days.Mon')]: 1,
    [t('days.Tue')]: 2,
    [t('days.Wed')]: 3,
    [t('days.Thu')]: 4,
    [t('days.Fri')]: 5,
    [t('days.Sat')]: 6,
    [t('days.Today')]: 7
  }

  const reverseDayMapping = Object.keys(dayMapping).reduce((acc, key) => {
    acc[dayMapping[key]] = key
    return acc
  }, {})

  const daysOfWeek = Object.keys(dayMapping).slice(0, 7)

  const toggleDaySelection = day => {
    const dayValue = dayMapping[day]
    setSelectedDays(prevDays => {
      const newDays = prevDays.includes(dayValue)
        ? prevDays.filter(selectedDay => selectedDay !== dayValue)
        : [...prevDays, dayValue]
      return newDays.sort((a, b) => a - b)
    })
  }

  const selectedDaysWithToday =
    selectedDays.length === 0 ? [dayMapping[t('days.Today')]] : selectedDays

  return {
    selectedDays: selectedDaysWithToday,
    dayMapping,
    setSelectedDays,
    reverseDayMapping,
    daysOfWeek,
    toggleDaySelection
  }
}
