import { useState } from 'react'

export const useToggleSwitch = (initialValue = false) => {
  const [isEnabled, setIsEnabled] = useState(initialValue)

  const toggleSwitch = () => setIsEnabled(previousState => !previousState)

  return {
    isEnabled,
    toggleSwitch,
    setIsEnabled
  }
}
