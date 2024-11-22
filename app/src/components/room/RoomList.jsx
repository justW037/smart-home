import { Text, View, Modal, TouchableOpacity, FlatList } from 'react-native'
import tw from 'twrnc'
import RoomComponent from './Room'
import { useState, useEffect, Children } from 'react'
import { Icon } from 'react-native-elements'
import RoomMenu from './RoomMenu'
import useRoomStore from '../../zustand/roomStore'
import useDeviceStore from '../../zustand/deviceStore'
import useUserStore from '../../zustand/userStore'
import RoomLoading from '../loading/RoomLoading'
import useHomeStore from '../../zustand/homeStore'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'

export default function RoomListComponent() {
  const { rooms, setRoom, room, loading } = useRoomStore(state => ({
    rooms: state.rooms,
    setRoom: state.setRoom,
    room: state.room,
    loading: state.loading
  }))

  const isLoggedIn = useUserStore(state => state.isLoggedIn)

  const [fetchedRoomIds, setFetchedRoomIds] = useState([])
  const [visible, setVisible] = useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const { fetchDevices } = useDeviceStore(state => ({
    fetchDevices: state.fetchDevices
  }))

  useEffect(() => {
    if (!isLoggedIn) {
      setFetchedRoomIds([])
    }
  }, [isLoggedIn])

  const handleSelectRoom = roomId => {
    const selectedRoom = rooms.find(room => room.id === roomId)
    setRoom(selectedRoom)
  }

  const { loadingHome, homes } = useHomeStore(state => ({
    loadingHome: state.loading,
    homes: state.homes
  }))

  const { t } = useTranslation()
  useEffect(() => {
    if (room?.id && !fetchedRoomIds.includes(room.id)) {
      fetchDevices(room.id)
      setFetchedRoomIds(prev => [...prev, room.id])
    }
  }, [room, fetchDevices, fetchedRoomIds])

  if (loadingHome || loading || homes.length === 0) {
    return <RoomLoading />
  }

  const { theme } = useTheme()
  const isDarkTheme = theme === 'dark'

  return (
    <View style={tw`mt-4`}>
      <View style={tw`flex-row justify-between`}>
        <Text
          style={tw`text-2xl font-bold mb-2 mr-2 ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}
        >
          {t('roomList.rooms')}
        </Text>
        <TouchableOpacity onPress={openMenu}>
          <Icon
            name="more-vert"
            type="material"
            color={isDarkTheme ? '#ffffff' : '#000000'}
            size={26}
            style={tw`pt-1`}
          />
        </TouchableOpacity>
        {visible && (
          <RoomMenu
            visible={visible}
            closeMenu={closeMenu}
            isDarkTheme={isDarkTheme}
          />
        )}
      </View>
      {!loading && rooms.length === 0 ? (
        <Text style={tw` ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}>{t('roomList.noRoomFound')}</Text>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <RoomComponent
              isDarkTheme={isDarkTheme}
              name={item.room_name}
              selected={room?.id === item.id}
              onPress={() => handleSelectRoom(item.id)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={tw`w-4`} />}
          contentContainerStyle={tw`mt-2`}
        />
      )}
    </View>
  )
}
