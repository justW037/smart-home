import { View, TouchableOpacity, Text } from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import Drawer from './DrawerMenu'
import EditHomeModal from '../home/EditHomeModal'
import { useModal } from '../../hooks/useModal'
import { useTranslation } from 'react-i18next'

export default function HeaderComponent({ isDarkTheme, navigation }) {
  const EditHomeToggle = useModal()
  const DrawlerToggle = useModal()
  const { t } = useTranslation()

  return (
    <>
      <View
        style={tw`flex-row justify-between mt-3 p-3 rounded-full ${
          isDarkTheme ? 'bg-zinc-800' : 'bg-gray-100'
        }`}
      >
        <TouchableOpacity onPress={DrawlerToggle.toggleModal}>
          <Icon
            name="menu"
            type="material"
            color={isDarkTheme ? '#ffffff' : '#000000'}
            size={26}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[tw`flex-1 px-3 text-center `]}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={[tw`${isDarkTheme ? 'text-zinc-400' : 'text-gray-500'} text-base`]}>{t('findDevice')}</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={EditHomeToggle.toggleModal}>
          <Icon
            name="home"
            type="material"
            color={isDarkTheme ? '#ffffff' : '#000000'}
            size={26}
          />
        </TouchableOpacity>
      </View>
      <Drawer
        isDarkTheme={isDarkTheme}
        isModalVisible={DrawlerToggle.isModalVisible}
        toggleModal={DrawlerToggle.toggleModal}
      />
      <EditHomeModal
        isDarkTheme={isDarkTheme}
        isVisible={EditHomeToggle.isModalVisible}
        toggleModal={EditHomeToggle.toggleModal}
      />
    </>
  )
}
