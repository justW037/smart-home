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
import { Children, useState } from 'react'
import useInputFocus from '../../hooks/useInputFocus'
import useTypeStore from '../../zustand/typeStore'
import useRoomStore from '../../zustand/roomStore'
import RoomComponent from '../room/Room'
import useDeviceStore from '../../zustand/deviceStore'
import { getDataForType } from '../../utils/typeHelpers'
import { useTranslation } from 'react-i18next'

export default function EditDeviceModal({
  isModalVisible,
  toggleModal,
  isDarkTheme
}) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { focusedInput, handleFocus, handleBlur } = useInputFocus()
  const rooms = useRoomStore(state => state.rooms)
  const types = useTypeStore(state => state.types)
  const { device, updateDevice } = useDeviceStore(state => ({
    device: state.device,
    updateDevice: state.updateDevice
  }))
  const [deviceName, setDeviceName] = useState(
    device.device_name ? device.device_name : ''
  )
  const [selectedDeviceType, setSelectedDeviceType] = useState(
    device.type_id ? device.type_id : ''
  )
  const [selectedRoom, setSelectedRoom] = useState(
    device.room_id ? device.room_id : ''
  )

  const [port, setPort] = useState(device.port ? device.port : '')

  const handleDeviceTypeSelect = item => {
    setSelectedDeviceType(item.id)
  }

  const handleSelectRoom = id => {
    setSelectedRoom(id)
  }

  const handleResetForm = () => {
    setDeviceName(device.device_name ? device.device_name : '')
    setSelectedDeviceType(device.type_id ? device.type_id : '')
    setSelectedRoom(device.room_id ? device.room_id : '')
  }

  const handleUpdateDevice = async () => {
    if (deviceName && selectedDeviceType && selectedRoom) {
      setLoading(true)
      try {
        await updateDevice(
          device.id,
          deviceName,
          selectedDeviceType,
          selectedRoom,
          port
        )
        toggleModal()
      } catch (error) {
        console.log(error)
        alert(t('editDeviceModal.failToUpdateDevice'))
      } finally {
        setLoading(false)
      }
    } else {
      alert(t('editDeviceModal.inputCheck'))
    }
  }

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
      <View
        style={tw`${
          isDarkTheme ? 'bg-neutral-900' : 'bg-white'
        } p-4 pb-2 rounded-t-3xl`}
      >
        <View
          style={tw`${
            isDarkTheme ? 'bg-white' : 'bg-black'
          } h-1 w-10 rounded-lg self-center`}
        ></View>
        <View style={tw`flex-row justify-between`}>
          <Text
            style={tw`${
              isDarkTheme ? 'text-white' : 'text-black'
            } text-lg font-bold mb-2`}
          >
            {t('editDeviceModal.editDeviceTitle')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              handleResetForm()
              toggleModal()
            }}
          >
            <Icon
              name="close"
              type="material"
              color={isDarkTheme ? '#ffffff' : '#000000'}
              size={26}
              style={tw`pt-1`}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } text-base font-semibold mt-5`}
        >
          {t('addDeviceModal.room')}
        </Text>
        <FlatList
          data={rooms}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <RoomComponent
              isDarkTheme={isDarkTheme}
              name={item.room_name}
              selected={selectedRoom === item.id}
              onPress={() => handleSelectRoom(item.id)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={tw`w-4`} />}
          contentContainerStyle={tw`mt-2`}
        />
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } text-base font-semibold mt-5`}
        >
          {t('addDeviceModal.deviceType')}
        </Text>
        <FlatList
          data={types}
          renderItem={({ item }) => {
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
          }}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={tw`w-2`} />}
          style={tw`mb-4 mt-1`}
        />
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } text-base font-semibold mb-2`}
        >
          {t('addDeviceModal.deviceName')}
        </Text>
        <TextInput
          placeholder={t('addDeviceModal.deviceName')}
          value={deviceName}
          onChangeText={setDeviceName}
          onFocus={() => handleFocus('deviceName')}
          onBlur={handleBlur}
          style={[
            tw`border border-gray-300 rounded-2xl py-3 px-4 mb-4 w-full`,
            focusedInput === 'deviceName'
              ? isDarkTheme
                ? tw`border-white`
                : tw`border-black`
              : isDarkTheme
              ? tw`border-gray-500`
              : tw`border-gray-300`,
            isDarkTheme ? tw`bg-zinc-800 text-white` : 'bg-white '
          ]}
          placeholderTextColor={isDarkTheme ? '#a1a1aa' : '#6b7280'}
        />
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } text-base font-semibold mb-2`}
        >
          {t('addDeviceModal.devicePort')}
        </Text>
        <TextInput
          placeholder={t('addDeviceModal.devicePort')}
          value={port}
          onChangeText={setPort}
          onFocus={() => handleFocus('devicePort')}
          onBlur={handleBlur}
          style={[
            tw`border border-gray-300 rounded-2xl py-3 px-4 mb-4 w-full`,
            focusedInput === 'devicePort'
              ? isDarkTheme
                ? tw`border-white`
                : tw`border-black`
              : isDarkTheme
              ? tw`border-gray-500`
              : tw`border-gray-300`,
            isDarkTheme ? tw`bg-zinc-800 text-white` : 'bg-white '
          ]}
          placeholderTextColor={isDarkTheme ? '#a1a1aa' : '#6b7280'}
        />
        {loading ? (
          <ActivityIndicator color={isDarkTheme ? '#ffffff' : '#000000'} />
        ) : (
          <View style={tw`justify-center items-center`}>
            <TouchableOpacity
              style={tw`${
                isDarkTheme ? 'bg-white' : 'bg-black'
              } p-2 mt-4 rounded-full w-full items-center`}
              onPress={handleUpdateDevice}
            >
              <Text style={tw`${isDarkTheme ? 'text-black' : 'text-white'}`}>
                {t('editDeviceModal.editDeviceTitle')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  )
}
