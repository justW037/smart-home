import { View, Text, TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import useUserStore from '../../zustand/userStore'
import useDeviceStore from '../../zustand/deviceStore'
import useHomeStore from '../../zustand/homeStore'
import useRoomStore from '../../zustand/roomStore'
import useTypeStore from '../../zustand/typeStore'
import { useModal } from '../../hooks/useModal'
import ConfirmModal from './ConfirmModal'
import { useTranslation } from 'react-i18next'
import LanguagePicker from './LanguagePicker'
import ThemePicker from './ThemePicker'
import useMessageStore from '../../zustand/messageStore'

export default function Drawer({ isModalVisible, toggleModal, isDarkTheme }) {
  const logout = useUserStore(state => state.logout)
  const resetTypes = useTypeStore(state => state.resetTypes)
  const resetRooms = useRoomStore(state => state.resetRooms)
  const resetDevices = useDeviceStore(state => state.resetDevices)
  const resetHomes = useHomeStore(state => state.resetHomes)
  const resetMessages = useMessageStore(state => state.resetMessages)
  const languagePickerModal = useModal()
  const themeModal = useModal()
  const confirmModal = useModal()
  const { t } = useTranslation()
  const handleLogout = () => {
    logout()
    resetTypes()
    resetRooms()
    resetDevices()
    resetHomes()
    resetMessages()
    toggleModal()
  }

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={tw`m-0 justify-center `}
        wipeDirection="right"
        onSwipeComplete={toggleModal}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
      >
        <View
          style={tw`${
            isDarkTheme ? 'bg-neutral-900' : 'bg-white '
          } p-4 w-3/4 h-10/12 rounded-r-3xl gap-4`}
        >
          <Text
            style={tw`${
              isDarkTheme ? 'text-white border-white' : 'text-black'
            } text-2xl font-bold pb-3 border-b `}
          >
            {t('drawerMenu.title')}
          </Text>
          <View style={tw`flex-col gap-4`}>
            <Text
              style={tw`${
                isDarkTheme ? 'text-white' : 'text-black'
              } text-xl font-semibold`}
            >
              {t('drawerMenu.customize')}
            </Text>
            <TouchableOpacity
              style={tw`flex-row items-center gap-2`}
              onPress={themeModal.toggleModal}
            >
              <Icon
                name="contrast"
                type="material"
                color={isDarkTheme ? '#ffffff' : '#000000'}
                size={20}
              />
              <Text
                style={tw`${isDarkTheme ? 'text-white' : 'text-black'} text-xl`}
              >
                {t('drawerMenu.theme')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-row items-center gap-2`}
              onPress={languagePickerModal.toggleModal}
            >
              <Icon
                name="translate"
                type="material"
                color={isDarkTheme ? '#ffffff' : '#000000'}
                size={20}
              />
              <Text
                style={tw`${isDarkTheme ? 'text-white' : 'text-black'} text-xl`}
              >
                {t('drawerMenu.language')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmModal.toggleModal}
              style={tw`flex-row items-center gap-2 border-t ${
                isDarkTheme && 'border-white'
              } pt-2`}
            >
              <Icon
                name="logout"
                type="material"
                color={isDarkTheme ? '#ffffff' : '#000000'}
                size={20}
              />
              <Text
                style={tw`${isDarkTheme ? 'text-white' : 'text-black'} text-xl`}
              >
                {t('drawerMenu.logout')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ConfirmModal
        isVisible={confirmModal.isModalVisible}
        onCancel={confirmModal.toggleModal}
        onConfirm={handleLogout}
        message={t('drawerMenu.logoutConfirmMessage')}
        confirmText={t('drawerMenu.logoutConfirmText')}
      />
      <LanguagePicker
        isDarkTheme={isDarkTheme}
        isVisible={languagePickerModal.isModalVisible}
        toggleModal={languagePickerModal.toggleModal}
      />
      <ThemePicker
        isVisible={themeModal.isModalVisible}
        toggleModal={themeModal.toggleModal}
      />
    </>
  )
}
