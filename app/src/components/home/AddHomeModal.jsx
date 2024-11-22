import Modal from 'react-native-modal'
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import tw from 'twrnc'
import { Icon } from 'react-native-elements'
import { useState } from 'react'
import useHomeStore from '../../zustand/homeStore'
import useUserStore from '../../zustand/userStore'
import useInputFocus from '../../hooks/useInputFocus'
import { useTranslation } from 'react-i18next'

export default function AddHomeModal({
  isModalVisible,
  toggleModal,
  isDarkTheme
}) {
  const [homeName, setHomeName] = useState('')
  const [loading, setLoading] = useState(false)
  const addHome = useHomeStore(state => state.addHome)
  const user = useUserStore(state => state.user)
  const { focusedInput, handleFocus, handleBlur } = useInputFocus()
  const { t } = useTranslation()

  const handleAddHome = async () => {
    if (homeName && user.id) {
      setLoading(true)
      try {
        await addHome(homeName, user.id)
        setHomeName('')
        toggleModal()
      } catch (error) {
        alert(t('addHomeModal.failToAdd'))
      } finally {
        setLoading(false)
      }
    } else {
      alert(t('addHomeModal.inputCheck'))
    }
  }

  const handleResetForm = () => {
    setHomeName('')
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
      <View style={tw`${ isDarkTheme ? 'bg-neutral-900' : 'bg-white'} p-4 rounded-t-3xl gap-4`}>
        <View style={tw`${
            isDarkTheme ? 'bg-white' : 'bg-black'
          } h-1 w-10 rounded-lg self-center`}></View>
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`${isDarkTheme ?'text-white':'text-black'} text-lg font-bold mb-2`}>
            {t('addHomeModal.addHomeTitle')}
          </Text>
          <TouchableOpacity onPress={toggleModal}>
            <Icon
              name="close"
              type="material"
              color={isDarkTheme ? '#ffffff' : '#000000'}
              size={26}
              style={tw`pt-1`}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder={t('addHomeModal.homeName')}
          value={homeName}
          onChangeText={setHomeName}
          onFocus={() => handleFocus('homeName')}
          onBlur={handleBlur}
          style={[
            tw`border border-gray-300 rounded-2xl py-3 px-4 mb-4 w-full`,
            focusedInput === 'homeName'
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
             style={tw`${isDarkTheme ? 'bg-white' : 'bg-black'} p-2 mt-4 rounded-full w-full items-center`}
              onPress={handleAddHome}
            >
              <Text style={tw`${isDarkTheme ?'text-black':'text-white'}`}>
                {t('addHomeModal.addHomeTitle')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  )
}
