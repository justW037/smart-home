import { useState } from 'react'

export default function useInputFocus() {
  const [focusedInput, setFocusedInput] = useState(null)

  const handleFocus = inputName => {
    setFocusedInput(inputName)
  }

  const handleBlur = () => {
    setFocusedInput(null)
  }

  return { focusedInput, handleFocus, handleBlur }
}
