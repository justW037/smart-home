import { create } from 'zustand'

const useMessageStore = create(set => ({
  messages: [],
  sensorData: { temperature: null, humidity: null },
  setMessages: newMessages => set({ messages: newMessages }),
  addMessage: message =>
    set(state => {
      const existingIndex = state.messages.findIndex(
        msg => msg.device_id === message.device_id
      )

      if (existingIndex !== -1) {
        const updatedMessages = [...state.messages]
        if (updatedMessages[existingIndex].command !== message.command) {
          updatedMessages[existingIndex] = message
          return { messages: updatedMessages }
        }
        return state
      } else {
        return { messages: [...state.messages, message] }
      }
    }),
  setSensorData: sensorData =>
    set(() => ({
      sensorData
    })),
  resetMessages: () => {
    set({ messages: [], sensorData: { temperature: null, humidity: null } })
  }
}))
export default useMessageStore
