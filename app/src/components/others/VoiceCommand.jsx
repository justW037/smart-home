import { useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent
} from 'expo-speech-recognition'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import useDeviceStore from '../../zustand/deviceStore'
import useMessageStore from '../../zustand/messageStore'
import useHomeStore from '../../zustand/homeStore'
import useTypeStore from '../../zustand/typeStore'
import { getCommandByTranScript } from '../../utils/getCommandByTranScript'

export default function VoiceCommand({ sendMessage }) {
  const [recognizing, setRecognizing] = useState(false)
  const [transcript, setTranscript] = useState('')
 

  useSpeechRecognitionEvent('start', () => setRecognizing(true))
  useSpeechRecognitionEvent('end', () => setRecognizing(false))
  useSpeechRecognitionEvent('result', event => {
    setTranscript(event.results[0]?.transcript)
  })
  useSpeechRecognitionEvent('error', event => {
    console.log('error code:', event.error, 'error message:', event.message)
  })

  const { fetchDeviceByNameAndRoomName, fetchDeviceByTypeId } = useDeviceStore(
    state => ({
      fetchDeviceByNameAndRoomName: state.fetchDeviceByNameAndRoomName,
      fetchDeviceByTypeId: state.fetchDeviceByTypeId
    })
  )

  const { addMessage } = useMessageStore(state => ({
    addMessage: state.addMessage
  }))

  const { homes } = useHomeStore(state => ({
    homes: state.homes
  }))
  const firstHomeId = homes?.length > 0 ? homes[0].id : null

  const { types } = useTypeStore(state => ({
    types: state.types
  }))

  const getTypeByName = name => {
    return types.find(type => type.name === name)
  }

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync()
    if (!result.granted) {
      console.warn('Permissions not granted', result)
      return
    }
    ExpoSpeechRecognitionModule.start({
      lang: 'vi-VN',
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: ['Carlsen', 'Nepomniachtchi', 'Praggnanandhaa']
    })
  }

  const handleStop = async () => {
    await ExpoSpeechRecognitionModule.stop()
    await handleSubmit()
  }

  const handleSubmit = async () => {
    const { action, roomName, deviceName, applyToAll } =
      await getCommandByTranScript(transcript)
      console.log(  action, roomName, deviceName, applyToAll)
    if (!applyToAll) {
      const device = await fetchDeviceByNameAndRoomName(
        deviceName,
        roomName,
        firstHomeId
      )
      if (device) {
        const message = {
          device_id: device.id.toString(),
          port: device.port,
          command: action
        }
        sendMessage(JSON.stringify(message))
        addMessage(message)
      }
    } else {
      const typeId = getTypeByName(deviceName)?.id
      const devices = await fetchDeviceByTypeId(typeId, firstHomeId, roomName)
      devices.forEach(device => {
        const message = {
          device_id: device.id.toString(),
          port: device.port,
          command: action
        }
        sendMessage(JSON.stringify(message))
        addMessage(message)
      })
    }
    setTranscript('')
  }


  return (
    <View
      style={tw`absolute bottom-8 right-0 flex-1 justify-center items-center p-4 z-50`}
    >
      <TouchableOpacity
        style={tw`w-16 h-16 rounded-full ${
          recognizing ? 'bg-red-500' : 'bg-white'
        } justify-center items-center`}
        onPressIn={handleStart}
        onPressOut={handleStop}
        disabled={recognizing}
      >
        <Icon
          name="mic"
          type="material"
          color={recognizing ? '#ffffff' : '#000000'}
          size={22}
        />
      </TouchableOpacity>
    </View>
  )
}
