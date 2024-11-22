import React, { useState, useEffect } from 'react'
import Modal from 'react-native-modal'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import useInputFocus from '../../hooks/useInputFocus'
import RoomType from './RoomType'
import useRoomStore from '../../zustand/roomStore'
import useHomeStore from '../../zustand/homeStore'
import { roomType } from './RoomType'
import { useTranslation } from 'react-i18next'
import { getDataForRoomType } from '../../utils/typeHelpers'

export default function EditRoomModal({
  isModalVisible,
  toggleModal,
  isDarkTheme
}) {
  const { updateRoom, room } = useRoomStore(state => ({
    updateRoom: state.updateRoom,
    room: state.room
  }))
  const [roomName, setRoomName] = useState(room?.room_name || '')
  const [loading, setLoading] = useState(false)
  const { focusedInput, handleFocus, handleBlur } = useInputFocus()
  const [selectedRoomType, setSelectedRoomType] = useState(
    roomType[0].name || ''
  )

  useEffect(() => {
    if (room) {
      const matchedRoomType = roomType.find(type =>
        room.room_name.toLowerCase().startsWith(type.name.toLowerCase())
      )
      if (matchedRoomType) {
        const namePart = room.room_name
          .slice(matchedRoomType.name.length)
          .trim()
        setRoomName(namePart)
        setSelectedRoomType(matchedRoomType.name)
      } else {
        setRoomName('')
        setSelectedRoomType(roomType[0].name)
      }
    }
  }, [room])

  const handleRoomTypeSelect = item => {
    setSelectedRoomType(item.name)
  }

  const { t } = useTranslation()
  const homes = useHomeStore(state => state.homes)
  const firstHomeId = homes.length > 0 ? homes[0].id : null

  const handleUpdateRoom = async () => {
    if (roomName && selectedRoomType) {
      setLoading(true)
      try {
        await updateRoom(
          room?.id,
          selectedRoomType + ' ' + roomName,
          firstHomeId
        )
        setRoomName('')
        toggleModal()
      } catch (error) {
        alert(t('editRoomModal.failToUpdate'))
      } finally {
        setLoading(false)
      }
    } else {
      alert(t('editRoomModal.inputCheck'))
    }
  }

  const handleResetForm = () => {
    setRoomName(room?.room_name || '')
    setSelectedRoomType(roomType[0].name || '')
  }

  const {tName} = getDataForRoomType(selectedRoomType)

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
        } p-4 rounded-t-3xl`}
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
            {t('editRoomModal.editRoomTitle')}
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
          {t('addRoomModal.roomType')}
        </Text>
        <FlatList
          data={roomType}
          renderItem={({ item }) => (
            <RoomType
              isDarkTheme={isDarkTheme}
              iconName={item.iconName}
              iconType={item.iconType}
              selected={selectedRoomType === item.name}
              onPress={() => handleRoomTypeSelect(item)}
            />
          )}
          keyExtractor={item => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={tw`w-4`} />}
          style={tw`mb-4 mt-1`}
        />
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } text-base font-semibold mb-2`}
        >
          {t('addRoomModal.roomName')}
        </Text>
        <View
          style={[
            tw`bg-white border border-gray-300 rounded-2xl py-2 px-4 mb-4 w-full flex-row items-center`,
            focusedInput === 'roomName'
              ? isDarkTheme
                ? tw`border-white`
                : tw`border-black`
              : isDarkTheme
              ? tw`border-gray-500`
              : tw`border-gray-300`,
            isDarkTheme ? tw`bg-zinc-800 text-white` : 'bg-white '
          ]}
        >
          <Text
            style={tw`${
              isDarkTheme ? 'text-white' : 'text-black'
            } mr-3 font-semibold`}
          >
            {t(tName)}
          </Text>
          <TextInput
            placeholder={t('addRoomModal.roomName')}
            value={roomName}
            onChangeText={setRoomName}
            onFocus={() => handleFocus('roomName')}
            onBlur={handleBlur}
            style={[
              tw`flex-1`,
              isDarkTheme ? tw`bg-zinc-800 text-white` : 'bg-white '
            ]}
            placeholderTextColor={isDarkTheme ? '#a1a1aa' : '#6b7280'}
          />
        </View>
        {loading ? (
          <ActivityIndicator color={isDarkTheme ? '#ffffff' : '#000000'} />
        ) : (
          <View style={tw`justify-center items-center`}>
            <TouchableOpacity
              style={tw`${isDarkTheme ? 'bg-white' : 'bg-black'} p-2 mt-4 rounded-full w-full items-center`}
              onPress={handleUpdateRoom}
            >
              <Text style={tw`${isDarkTheme ?'text-black':'text-white'}`}>
                {t('editRoomModal.editRoomTitle')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  )
}
