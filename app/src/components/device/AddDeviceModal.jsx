import Modal from 'react-native-modal'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator
} from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import { useCallback, useState } from 'react'
import useInputFocus from '../../hooks/useInputFocus'
import useTypeStore from '../../zustand/typeStore'
import useRoomStore from '../../zustand/roomStore'
import RoomComponent from '../room/Room'
import useDeviceStore from '../../zustand/deviceStore'
import { getDataForType } from '../../utils/typeHelpers'
import { useTranslation } from 'react-i18next'

export default function AddDeviceModal({ isModalVisible, toggleModal, isDarkTheme }) {
  const { t } = useTranslation()
  const [deviceName, setDeviceName] = useState('')
  const [port, setPort] = useState('')
  const [loading, setLoading] = useState(false)

  const { focusedInput, handleFocus, handleBlur } = useInputFocus()

  const rooms = useRoomStore(state => state.rooms)
  const types = useTypeStore(state => state.types)
  const addDevice = useDeviceStore(state => state.addDevice)

  const [selectedDeviceType, setSelectedDeviceType] = useState(types[0]?.id || '')
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.id || '')

  const handleDeviceTypeSelect = useCallback(item => setSelectedDeviceType(item.id), [])
  const handleSelectRoom = useCallback(id => setSelectedRoom(id), [])

  const handleAddDevice = async () => {
    if (!deviceName || !selectedDeviceType) {
      alert(t('addDeviceModal.inputCheck'))
      return
    }
    setLoading(true)
    try {
      await addDevice(deviceName, selectedDeviceType, selectedRoom, port)
      setDeviceName('')
      setPort('')
      toggleModal()
    } catch (error) {
      console.log(error)
      alert(t('addDeviceModal.addFail'))
    } finally {
      setLoading(false)
    }
  }

  const handleResetForm = useCallback(() => {
    setDeviceName('')
    setPort('')
    setSelectedDeviceType(types[0]?.id || '')
    setSelectedRoom(rooms[0]?.id || '')
  }, [types, rooms])

  const renderRoomComponent = useCallback(({ item }) => (
    <RoomComponent
      isDarkTheme={isDarkTheme}
      name={item.room_name}
      selected={selectedRoom === item.id}
      onPress={() => handleSelectRoom(item.id)}
    />
  ), [selectedRoom, isDarkTheme])

  const renderDeviceType = useCallback(({ item }) => {
    const { iconName, iconType, tName } = getDataForType(item.type_name)
    return (
      <DeviceType
        isDarkTheme={isDarkTheme}
        iconName={iconName}
        iconType={iconType}
        selected={selectedDeviceType === item.id}
        onPress={() => handleDeviceTypeSelect(item)}
        name={t(tName)}
      />
    )
  }, [selectedDeviceType, isDarkTheme])

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={() => {
        handleResetForm()
        toggleModal()
      }}
      swipeDirection="down"
      onSwipeComplete={() => {
        handleResetForm()
        toggleModal()
      }}
      style={tw`m-0 justify-end h-36`}
    >
      <View style={tw`${isDarkTheme ? 'bg-neutral-900' : 'bg-white'} p-4 pb-2 rounded-t-3xl`}>
        <View style={tw`${isDarkTheme ? 'bg-white' : 'bg-black'} h-1 w-10 rounded-lg self-center`} />
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'} text-lg font-bold mb-2`}>
            {t('addDeviceModal.addDeviceTitle')}
          </Text>
          <TouchableOpacity onPress={toggleModal}>
            <Icon name="close" type="material" color={isDarkTheme ? '#ffffff' : '#000000'} size={26} />
          </TouchableOpacity>
        </View>

        <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'} text-base font-semibold mt-5`}>
          {t('addDeviceModal.room')}
        </Text>
        <FlatList
          data={rooms}
          keyExtractor={item => item.id}
          renderItem={renderRoomComponent}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={tw`w-4`} />}
          contentContainerStyle={tw`mt-2`}
        />

        <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'} text-base font-semibold mt-5`}>
          {t('addDeviceModal.deviceType')}
        </Text>
        <FlatList
          data={types}
          keyExtractor={item => item.id.toString()}
          renderItem={renderDeviceType}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={tw`w-2`} />}
          style={tw`mb-4 mt-1`}
        />

        <TextInputComponent
          label={t('addDeviceModal.deviceName')}
          value={deviceName}
          onChangeText={setDeviceName}
          placeholder={t('addDeviceModal.deviceName')}
          focusedInput={focusedInput}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          isDarkTheme={isDarkTheme}
          focusField="deviceName"
        />

        <TextInputComponent
          label={t('addDeviceModal.devicePort')}
          value={port}
          onChangeText={setPort}
          placeholder={t('addDeviceModal.devicePort')}
          focusedInput={focusedInput}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          isDarkTheme={isDarkTheme}
          focusField="devicePort"
        />

        {loading ? (
          <ActivityIndicator color={isDarkTheme ? '#ffffff' : '#000000'} />
        ) : (
          <TouchableOpacity style={tw`${isDarkTheme ? 'bg-white' : 'bg-black'} p-2 mt-4 rounded-full w-full items-center`} onPress={handleAddDevice}>
            <Text style={tw`${isDarkTheme ? 'text-black' : 'text-white'}`}>
              {t('addDeviceModal.addDevice')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  )
}

const TextInputComponent = ({ label, value, onChangeText, placeholder, focusedInput, handleFocus, handleBlur, isDarkTheme, focusField }) => (
  <>
    <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'} text-base font-semibold mb-2`}>{label}</Text>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onFocus={() => handleFocus(focusField)}
      onBlur={handleBlur}
      style={[
        tw`border border-gray-300 rounded-2xl py-3 px-4 mb-4 w-full`,
        focusedInput === focusField ? (isDarkTheme ? tw`border-white` : tw`border-black`) : tw`border-gray-300`,
        isDarkTheme ? tw`bg-zinc-800 text-white` : 'bg-white'
      ]}
      placeholderTextColor={isDarkTheme ? '#a1a1aa' : '#6b7280'}
    />
  </>
)