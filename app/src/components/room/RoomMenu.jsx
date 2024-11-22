import { Modal, TouchableOpacity, View, Text } from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import { useState } from 'react'
import AddRoomModal from './AddRoomModal'
import EditRoomModal from './EditRoomModal'
import { useModal } from '../../hooks/useModal'
import ConfirmModal from '../others/ConfirmModal'
import useRoomStore from '../../zustand/roomStore'
import useDeviceStore from '../../zustand/deviceStore'
import { useTranslation } from 'react-i18next'

const RoomMenu = ({ visible, closeMenu, isDarkTheme }) => {
  const addModal = useModal()
  const editModal = useModal()
  const confirmDeleteModal = useModal()

  const { deleteRoom, room } = useRoomStore(state => ({
    deleteRoom: state.deleteRoom,
    room: state.room
  }))

  const deleteDevicesByRoomId = useDeviceStore(
    state => state.deleteDevicesByRoomId
  )

  const { t } = useTranslation()

  const handleConfirmDeleteRoom = async () => {
    await deleteRoom(room.id)
    await deleteDevicesByRoomId(room.id)
    confirmDeleteModal.toggleModal()
  }

  return (
    <>
      <Modal transparent={true} animationType="fade" visible={visible}>
        <TouchableOpacity
          style={tw`flex-1`}
          onPress={closeMenu}
          activeOpacity={1}
        >
          <View style={tw`flex-1 justify-end`}>
            <View
              style={tw`${
                isDarkTheme ? 'bg-zinc-800' : 'bg-white'
              } absolute top-40 right-6 rounded-lg shadow-lg p-2 z-50 w-34`}
            >
              <TouchableOpacity
                onPress={() => addModal.toggleModal()}
                style={tw`p-2 flex-row justify-between`}
              >
                <Text
                  style={tw`${isDarkTheme ? 'text-gray-200' : 'text-black'}`}
                >
                  {t('addRoomModal.addRoom')}
                </Text>
                <Icon
                  name="add"
                  type="material"
                  color={isDarkTheme ? '#ffffff' : '#000000'}
                  size={19}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => editModal.toggleModal()}
                style={tw`p-2 flex-row justify-between`}
              >
                <Text
                  style={tw`${isDarkTheme ? 'text-gray-200' : 'text-black'}`}
                >
                  {t('editRoomModal.editRoomTitle')}
                </Text>
                <Icon
                  name="edit"
                  type="material"
                  color={isDarkTheme ? '#ffffff' : '#000000'}
                  size={19}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmDeleteModal.toggleModal()}
                style={tw`p-2 flex-row justify-between`}
              >
                <Text
                  style={tw`${isDarkTheme ? 'text-gray-200' : 'text-black'}`}
                >
                  {t('roomMenu.deleteRoom')}
                </Text>
                <Icon
                  name="delete"
                  type="material"
                  color={isDarkTheme ? '#ffffff' : '#000000'}
                  size={19}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <AddRoomModal
        isDarkTheme={isDarkTheme}
        isModalVisible={addModal.isModalVisible}
        toggleModal={() => addModal.toggleModal()}
      />
      <EditRoomModal
        isDarkTheme={isDarkTheme}
        isModalVisible={editModal.isModalVisible}
        toggleModal={() => editModal.toggleModal()}
      />
      <ConfirmModal
        isVisible={confirmDeleteModal.isModalVisible}
        onCancel={confirmDeleteModal.toggleModal}
        onConfirm={handleConfirmDeleteRoom}
        message={t('roomMenu.confirmDelete')}
        confirmText={t('roomMenu.confirmText')}
      />
    </>
  )
}

export default RoomMenu
