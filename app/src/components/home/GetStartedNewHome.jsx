import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import tw from 'twrnc'
import AddHomeModal from './AddHomeModal'
import { useModal } from '../../hooks/useModal'
import { useTranslation } from 'react-i18next'
import useDeviceStore from '../../zustand/deviceStore'
import useHomeStore from '../../zustand/homeStore'
import useMessageStore from '../../zustand/messageStore'
import useRoomStore from '../../zustand/roomStore'
import useTypeStore from '../../zustand/typeStore'
import useUserStore from '../../zustand/userStore'

export default function GetStartedNewHome({ isDarkTheme }) {
  const { t } = useTranslation()
  const addHomeToggle = useModal()
  const logout = useUserStore(state => state.logout)
  const resetTypes = useTypeStore(state => state.resetTypes)
  const resetRooms = useRoomStore(state => state.resetRooms)
  const resetDevices = useDeviceStore(state => state.resetDevices)
  const resetHomes = useHomeStore(state => state.resetHomes)
  const resetMessages = useMessageStore(state => state.resetMessages)

  const handleLogout = () => {
    logout()
    resetTypes()
    resetRooms()
    resetDevices()
    resetHomes()
    resetMessages()
  }

  return (
    <View
      style={tw`${isDarkTheme ? 'bg-neutral-900' : 'bg-white'} flex-1 gap-30`}
    >
      <View style={tw`pt-20 px-10`}>
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } text-3xl font-bold text-start w-3/4`}
        >
          {t('getStartedNewHome.getStarted')}
        </Text>
        <Text
          style={tw`${
            isDarkTheme ? 'text-white' : 'text-black'
          } mt-2 text-start`}
        >
          {t('getStartedNewHome.addNewHome')}
        </Text>
      </View>
      <TouchableOpacity
        style={tw`absolute bottom-10 left-10 bg-white text-black p-3 mt-8 rounded-lg w-1/3 z-50`}
        onPress={handleLogout}
      >
        <Text style={tw`text-black w-full text-center`}>
          {t('drawerMenu.logout')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`absolute bottom-10 right-10 bg-black p-3 mt-8 rounded-lg w-1/3 z-50`}
        onPress={addHomeToggle.toggleModal}
      >
        <Text style={tw`text-white w-full text-center`}>
          {t('addHomeModal.addHomeTitle')}
        </Text>
      </TouchableOpacity>
      <Image
        source={require('../../../assets/image/house.png')}
        style={tw`w-full `}
        resizeMode="contain"
      />
      <AddHomeModal
        isDarkTheme={isDarkTheme}
        isModalVisible={addHomeToggle.isModalVisible}
        toggleModal={addHomeToggle.toggleModal}
      />
    </View>
  )
}
