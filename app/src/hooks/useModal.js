import { useState } from 'react'

export function useModal() {
  const [isModalVisible, setModalVisible] = useState(false)

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  return {
    isModalVisible,
    toggleModal
  }
}
