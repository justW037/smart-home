import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import DeviceComponent from './Device'
import { useState, useEffect, useMemo } from 'react'
import AddDeviceModal from './AddDeviceModal'
import useDeviceStore from '../../zustand/deviceStore'
import useTypeStore from '../../zustand/typeStore'
import { getDataForType } from '../../utils/typeHelpers'
import useRoomStore from '../../zustand/roomStore'
import DeviceLoading from '../loading/DeviceLoading'
import { useModal } from '../../hooks/useModal'
import useWebSocket from '../../hooks/useWebSocket'
import { WEBSOCKET_URL } from '@env'
import useHomeStore from '../../zustand/homeStore'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import VoiceCommand from '../others/VoiceCommand'

export default function DeviceListComponent({ navigation }) {
  const addDeviceToggle = useModal()
  const { devices, loading, setDevice, fetchDevices, getTotalPage } =
    useDeviceStore(state => ({
      devices: state.devices,
      loading: state.loading,
      setDevice: state.setDevice,
      fetchDevices: state.fetchDevices,
      getTotalPage: state.getTotalPage
    }))

  const typesList = useTypeStore(state => state.types)

  const { room, loadingRoom } = useRoomStore(state => ({
    room: state.room,
    loadingRoom: state.loading
  }))

  const devicesList = useMemo(() => {
    return devices.filter(device => device.room_id === room?.id)
  }, [devices, room?.id])

  const getTypeNameById = typeId => {
    const matchedType = typesList.find(type => type.id === typeId)
    return matchedType ? matchedType.type_name : ''
  }

  const homes = useHomeStore(state => state.homes)
  const firstHomeIp = homes?.length > 0 ? homes[0].home_ip : null

  const { connected, messages, sendMessage } = useWebSocket(
    WEBSOCKET_URL,
    firstHomeIp
  )
  const getMessageForDevice = deviceId => {
    return messages.find(message => message.device_id == deviceId)
  }

  const { t } = useTranslation()
  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'
  const totalPage = getTotalPage(room?.id)
  const [currentPageMap, setCurrentPageMap] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  useEffect(() => {
    if (room?.id) {
      if (currentPageMap[room.id] !== undefined) {
        setCurrentPage(currentPageMap[room.id])
      } else {
        setCurrentPage(0)
      }
    }
  }, [room?.id])

  useEffect(() => {
    if (isFetchingMore) {
      fetchDevices(room?.id, currentPage).finally(() =>
        setIsFetchingMore(false)
      )
    }
  }, [isFetchingMore])

  const handleScrollEnd = ({
    layoutMeasurement,
    contentOffset,
    contentSize
  }) => {
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
      if (currentPage + 1 < totalPage) {
        setIsFetchingMore(true)
        setCurrentPage(prevPage => {
          const nextPage = prevPage + 1
          setCurrentPageMap(prevMap => ({
            ...prevMap,
            [room?.id]: nextPage
          }))
          return nextPage
        })
      }
    }
  }

  if ((loadingRoom || loading || !room) && currentPage === 0) {
    return <DeviceLoading />
  }

  return (
    <View style={tw`relative mt-4 flex-1`}>
      <VoiceCommand sendMessage={sendMessage} />
      <View style={tw` flex-row justify-between `}>
        <View style={tw`relative`}>
          <Text
            style={tw`text-2xl font-bold mb-2 mr-2 ${
              isDarkTheme ? 'text-white' : 'text-black'
            }`}
          >
            {t('deviceList.devices')}
          </Text>
          <View
            style={tw`absolute right-[-5px] top-1 h-2 w-2 rounded-full ${
              connected ? 'bg-green-600' : 'bg-red-600 '
            }`}
          ></View>
        </View>
        <TouchableOpacity onPress={addDeviceToggle.toggleModal}>
          <Icon
            name="add"
            type="material"
            color={isDarkTheme ? '#ffffff' : '#000000'}
            size={26}
            style={tw`pt-1`}
          />
        </TouchableOpacity>
      </View>
      {!loading && devicesList.length === 0 ? (
        <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'}`}>
          {t('deviceList.noDeviceFound')}
        </Text>
      ) : (
        <ScrollView
          onScroll={({ nativeEvent }) => handleScrollEnd(nativeEvent)}
          scrollEventThrottle={200}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={tw`flex-row gap-2`}>
            <View style={tw`flex-col gap-2 flex-1`}>
              {devicesList
                .filter((_, i) => i % 2 === 0)
                .map((device, index) => {
                  const typeName = getTypeNameById(device.type_id)
                  const { iconName, iconType } = getDataForType(typeName)
                  const deviceMessage = getMessageForDevice(device?.id)
                  return (
                    <TouchableOpacity
                      onPress={() => (
                        setDevice(device),
                        navigation.navigate('Device', {
                          sendMessage
                        })
                      )}
                      key={device.id + 'A'}
                    >
                      <DeviceComponent
                        device={device}
                        iconName={iconName}
                        iconType={iconType}
                        typename={typeName}
                        deviceMessage={deviceMessage}
                        sendMessage={sendMessage}
                      />
                    </TouchableOpacity>
                  )
                })}
            </View>
            <View style={tw`flex-col gap-2 flex-1`}>
              {devicesList
                .filter((_, i) => i % 2 !== 0)
                .map((device, index) => {
                  const typeName = getTypeNameById(device.type_id)
                  const { iconName, iconType } = getDataForType(typeName)
                  const deviceMessage = getMessageForDevice(device?.id)
                  return (
                    <TouchableOpacity
                      onPress={() => (
                        setDevice(device),
                        navigation.navigate('Device', {
                          sendMessage
                        })
                      )}
                      key={device.id + 'B'}
                    >
                      <DeviceComponent
                        device={device}
                        iconName={iconName}
                        iconType={iconType}
                        typename={typeName}
                        deviceMessage={deviceMessage}
                        sendMessage={sendMessage}
                      />
                    </TouchableOpacity>
                  )
                })}
            </View>
          </View>
          {isFetchingMore && (
            <ActivityIndicator
              size="large"
              color={isDarkTheme ? '#ffffff' : '#000000'}
            />
          )}
        </ScrollView>
      )}
      <AddDeviceModal
        isDarkTheme={isDarkTheme}
        isModalVisible={addDeviceToggle.isModalVisible}
        toggleModal={addDeviceToggle.toggleModal}
      />
    </View>
  )
}
