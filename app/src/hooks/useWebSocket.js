import { useEffect, useState, useRef } from 'react'
import useMessageStore from '../zustand/messageStore'
import useDeviceStore from '../zustand/deviceStore'
const useWebSocket = (url, token) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const reconnectRef = useRef(null)
  const reconnectDelay = 3000

  const { messages, addMessage, setSensorData } = useMessageStore(state => ({
    messages: state.messages,
    addMessage: state.addMessage,
    setSensorData: state.setSensorData
  }))
  const { setTurnOnSchedules, setTurnOffSchedules } = useDeviceStore(state => ({
    setTurnOnSchedules: state.setTurnOnSchedules,
    setTurnOffSchedules: state.setTurnOffSchedules
  }))

  const connect = () => {
    const newSocket = new WebSocket(url)

    newSocket.onopen = () => {
      setConnected(true)
      newSocket.send(`token:${token}`)
      newSocket.send(`Hello: mobile`)
      console.log('WebSocket connected')
    }

    newSocket.onmessage = event => {
      if (event.data.startsWith('Hello')) {
        return
      }
      const message = JSON.parse(event.data)
      if (message.device_id !== 'DHT11') {
        if (message.action) {
          const scheduleData = {
            time: message.time,
            days: message.days,
            isTurnOn: message.isTurnOn
          }
          if (message.action === 'turnOn') {
            setTurnOnSchedules(
              message.device_id,
              message.device_port,
              scheduleData
            )
          } else if (message.action === 'turnOff') {
            setTurnOffSchedules(
              message.device_id,
              message.device_port,
              scheduleData
            )
          }
        } else {
          addMessage(message)
        }
      } else {
        setSensorData({
          temperature: message.temperature,
          humidity: message.humidity
        })
        console.log('Received sensor data:', message)
      }
    }

    newSocket.onclose = () => {
      setConnected(false)
      console.log('WebSocket disconnected, attempting to reconnect...')

      reconnectRef.current = setTimeout(() => {
        connect()
      }, reconnectDelay)
    }

    newSocket.onerror = error => {
      console.error('WebSocket error:', error)
    }

    setSocket(newSocket)
  }

  useEffect(() => {
    connect()
    return () => {
      if (socket) {
        socket.close()
      }
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current)
      }
    }
  }, [url])

  const sendMessage = message => {
    if (socket && connected) {
      socket.send(message)
      // console.log('Message sent:', message)
    } else {
      console.error('WebSocket is not connected')
    }
  }

  return { connected, messages, sendMessage }
}

export default useWebSocket
