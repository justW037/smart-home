import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch
} from 'react-native'
import tw from 'twrnc'
import useDeviceStore from '../../zustand/deviceStore'
import { Icon } from 'react-native-elements'
import useRoomStore from '../../zustand/roomStore'
import { useState, useEffect, useMemo } from 'react'
import EditDeviceModal from '../../components/device/EditDeviceModal'
import ScheduleModal from '../../components/device/ScheduleModal'
import { useModal } from '../../hooks/useModal'
import { useToggleSwitch } from '../../hooks/useToggleSwitch'
import useTypeStore from '../../zustand/typeStore'
import ConfirmModal from '../../components/others/ConfirmModal'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import DeviceSchedule from '../../components/others/DeviceSchedule'
import useMessageStore from '../../zustand/messageStore'
import SensorChart from '../../components/device/SensorChart'
import { getDataForRoomType } from '../../utils/typeHelpers'


const deviceImages = {
  light: require('../../../assets/image/light.png'),
  fan: require('../../../assets/image/fan.png'),
  screen: require('../../../assets/image/tv.png'),
  sensor: require('../../../assets/image/sensor.png'),
  camera: require('../../../assets/image/camera.png')
}

export default function Device({ navigation, route }) {
  const deviceSwitch = useToggleSwitch()
  const {
    device,
    setTurnOnSchedules,
    setTurnOffSchedules,
    deleteDevice,
    getTurnOnSchedules,
    getTurnOffSchedules
  } = useDeviceStore(state => ({
    device: state.device,
    setTurnOnSchedules: state.setTurnOnSchedules,
    setTurnOffSchedules: state.setTurnOffSchedules,
    deleteDevice: state.deleteDevice,
    getTurnOnSchedules: state.getTurnOnSchedules,
    getTurnOffSchedules: state.getTurnOffSchedules
  }))
  const { rooms } = useRoomStore(state => ({
    rooms: state.rooms
  }))

  const matchedRoom = rooms.find(room => room.id === device.room_id)

  const editDeviceModal = useModal()
  const scheduleModal = useModal()
  const confirmModal = useModal()

  const [isTurnOn, setIsTurnOn] = useState()

  const defaultSchedule = {
    device_id: device.id,
    device_port: device.port,
    days: [0, 1, 2, 3, 4, 5, 6],
    isTurnOn: false,
    time: '00:00'
  }

  const turnOnScheduleData = getTurnOnSchedules(device.id)
  const turnOffScheduleData = getTurnOffSchedules(device.id)
  const turnOnSchedule = turnOnScheduleData
    ? turnOnScheduleData
    : defaultSchedule
  const turnOffSchedule = turnOffScheduleData
    ? turnOffScheduleData
    : defaultSchedule

  const onSaveSchedule = schedule => {
    const scheduleData = {
      time: schedule.time,
      days: schedule.days,
      isTurnOn: schedule.isTurnOn
        ? turnOnSchedule.isTurnOn
        : turnOffSchedule.isTurnOn
    }
    const isTurnOnScheduleType = schedule.isTurnOn ? 'turnOn' : 'turnOff'
    const message = {
      device_id: device.id,
      device_port: device.port,
      action: isTurnOnScheduleType,
      ...scheduleData
    }
    if (schedule.isTurnOn) {
      setTurnOnSchedules(device.id, device.port, scheduleData)
    } else {
      setTurnOffSchedules(device.id, device.port, scheduleData)
    }
    sendMessage(JSON.stringify(message))
  }

  const typesList = useTypeStore(state => state.types)

  const getTypeForDevice = typeId => {
    const matchedType = typesList.find(type => type.id === typeId)
    return matchedType.type_name
  }
  const typeName = getTypeForDevice(device.type_id)

  const getImageForType = type_name => {
    return deviceImages[type_name.toLowerCase()]
  }

  const handleConfirmDelete = () => {
    deleteDevice(device.id)
    confirmModal.toggleModal()
    navigation.navigate('Home')
  }
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'
  const { sendMessage } = route.params

  const handleTurnOn = () => {
    deviceSwitch.toggleSwitch()
    const command = deviceSwitch.isEnabled ? 'off' : 'on'
    const message = {
      device_id: device.id.toString(),
      port: device.port,
      command: command
    }
    sendMessage(JSON.stringify(message))
    addMessage(message)
  }

  const roomTypeData = getDataForRoomType(matchedRoom.room_name)
  const namePart = matchedRoom.room_name.slice(roomTypeData.name.length).trim()

  const { sensorData, messages, addMessage } = useMessageStore(state => ({
    sensorData: state.sensorData,
    messages: state.messages,
    addMessage: state.addMessage
  }))

  const getMessageForDevice = deviceId => {
    return messages.find(message => message.device_id == deviceId)
  }
  const deviceMessage = getMessageForDevice(device.id)
  useEffect(() => {
    if (deviceMessage?.command !== undefined) {
      if (deviceMessage.command === 'on') {
        deviceSwitch.setIsEnabled(true)
      } else {
        deviceSwitch.setIsEnabled(false)
      }
    } else {
      deviceSwitch.setIsEnabled(false)
    }
  }, [deviceMessage])
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View
        style={tw`${
          isDarkTheme ? 'bg-neutral-900' : 'bg-white '
        } flex-col flex-1 px-5 justify-start `}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={tw`mt-3 items-start`}
        >
          <Icon
            name="left"
            type="antdesign"
            color={isDarkTheme ? '#ffffff' : '#000000'}
            size={22}
          />
        </TouchableOpacity>
        <View style={tw`relative`}>
          <Text
            style={[
              tw`${
                isDarkTheme ? 'text-zinc-800' : 'text-zinc-300'
              }  absolute top-7 left-4 text-5xl font-bold `
            ]}
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            {t(roomTypeData.tName) + ' ' + namePart}
          </Text>
          <Text
            style={[
              tw`${
                isDarkTheme ? 'text-white' : 'text-black'
              } mt-5  font-bold text-2xl`
            ]}
          >
            {t(roomTypeData.tName) + ' ' + namePart}
          </Text>
        </View>
        <View style={tw`flex-col items-start gap-3 pt-15 relative h-40`}>
          <Image
            source={getImageForType(typeName)}
            style={tw`h-60 absolute bottom-2 left-5`}
            resizeMode="contain"
          />
          <View style={tw`flex-row gap-3 items-center `}>
            <Text
              style={tw`${
                isDarkTheme ? 'text-white' : 'text-black'
              } font-semibold w-27`}
              numberOfLines={2}
            >
              {device.device_name}- {device.port}
            </Text>
            <TouchableOpacity onPress={editDeviceModal.toggleModal}>
              <Icon
                name="edit"
                type="material"
                color={isDarkTheme ? '#ffffff' : '#000000'}
                size={19}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmModal.toggleModal}>
              <Icon name="delete" type="material" color="#EA3323" size={19} />
            </TouchableOpacity>
          </View>
          {(typeName.toLowerCase() === 'light' ||
            typeName.toLowerCase() === 'screen') && (
            <Switch
              style={[
                tw`ml-2`,
                { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }
              ]}
              trackColor={{
                false: '#767577',
                true: isDarkTheme ? '#555555' : '#f4f3f4'
              }}
              thumbColor={
                deviceSwitch.isEnabled
                  ? '#ffffff'
                  : isDarkTheme
                  ? '#555555'
                  : '#f4f3f4'
              }
              onValueChange={handleTurnOn}
              value={deviceSwitch.isEnabled}
            />
          )}
          {typeName.toLowerCase() === 'sensor' && (
            <Text
              style={tw`${
                isDarkTheme ? 'text-gray-200' : 'text-black'
              } font-bold`}
            >
              {sensorData.temperature}°C /{sensorData.humidity}%
            </Text>
          )}
        </View>
        {typeName.toLowerCase() !== 'sensor' && (
          <View style={tw`mt-10 flex-col gap-7`}>
            <View style={tw`flex-col`}>
              <Text
                style={tw`${
                  isDarkTheme ? 'text-white' : 'text-black'
                } text-lg font-semibold`}
              >
                {t('device.schedule')}
              </Text>
              <Text style={tw`text-gray-400`}>{t('device.setSchedule')}</Text>
            </View>
            <DeviceSchedule
              title={t('device.autoTurnOn')}
              scheduleData={turnOnSchedule}
              isDarkTheme={isDarkTheme}
              isTurnOn={true}
              setIsTurnOn={setIsTurnOn}
              scheduleModal={scheduleModal}
              sendMessage={sendMessage}
            />
            <DeviceSchedule
              title={t('device.autoTurnOff')}
              scheduleData={turnOffSchedule}
              isDarkTheme={isDarkTheme}
              isTurnOn={false}
              setIsTurnOn={setIsTurnOn}
              scheduleModal={scheduleModal}
              sendMessage={sendMessage}
            />
          </View>
        )}
        {typeName.toLowerCase() === 'sensor' && (
          <SensorChart newSensorData={sensorData} isDarkTheme={isDarkTheme} />
        )}
      </View>
      <EditDeviceModal
        isDarkTheme={isDarkTheme}
        isModalVisible={editDeviceModal.isModalVisible}
        toggleModal={editDeviceModal.toggleModal}
      />
      <ScheduleModal
        isScheduleModalVisible={scheduleModal.isModalVisible}
        toggleScheduleModal={scheduleModal.toggleModal}
        isTurnOn={isTurnOn}
        scheduleData={isTurnOn ? turnOnSchedule : turnOffSchedule}
        onSaveSchedule={onSaveSchedule}
      />
      <ConfirmModal
        isVisible={confirmModal.isModalVisible}
        onCancel={confirmModal.toggleModal}
        onConfirm={handleConfirmDelete}
        message={t('device.confirmDeleteDevice')}
        confirmText={t('device.confirmText')}
      />
    </>
  )
}
