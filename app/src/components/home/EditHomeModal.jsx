import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { Icon } from 'react-native-elements'
import tw from 'twrnc'
import useInputFocus from '../../hooks/useInputFocus'
import Modal from 'react-native-modal'
import useHomeStore from '../../zustand/homeStore'
import { useTranslation } from 'react-i18next'

export default function EditHomeModal({ isVisible, toggleModal, isDarkTheme }) {
  const [homeName, setHomeName] = useState('')
  const [loading, setLoading] = useState(false)
  const { focusedInput, handleFocus, handleBlur } = useInputFocus()
  const { homes, updateHome } = useHomeStore(state => ({
    homes: state.homes,
    updateHome: state.updateHome
  }))
  const { t } = useTranslation()
  const firstHome = homes.length > 0 ? homes[0] : null
  useEffect(() => {
    if (firstHome) {
      setHomeName(firstHome?.home_name || '')
    }
  }, [firstHome])

  const handleEditHome = async () => {
    if (homeName) {
      setLoading(true)
      try {
        await updateHome(homeName, firstHome.u_id, firstHome.id)
        toggleModal()
      } catch (error) {
        alert(t('editHomeModal.failToUpdate'))
      } finally {
        setLoading(false)
      }
    } else {
      alert(t('editHomeModal.inputCheck'))
    }
  }

  const handleResetForm = () => {
    setHomeName(firstHome?.home_name || '')
  }

  const [tokenVisible, setTokenVisible] = useState(false)

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => {
        handleResetForm()
        toggleModal()
      }}
      swipeDirection="down"
      onSwipeComplete={() => {
        handleResetForm()
        toggleModal()
      }}
      style={tw`m-0 justify-end`}
    >
      <View
        style={tw`${
          isDarkTheme ? 'bg-neutral-900' : 'bg-white'
        } p-4 rounded-t-3xl gap-4`}
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
            {t('editHomeModal.editHomeTitle')}
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
        <View style={tw`flex-row items-center justify-between pr-3`}>
        <Text style={tw`${isDarkTheme ? 'text-white' : 'text-black'}`}>
            {t('editHomeModal.homeToken')} {tokenVisible ? firstHome?.home_ip : '*****************************************'}
          </Text>
          <TouchableOpacity onPress={() => setTokenVisible(!tokenVisible)}>
            <Icon
              name={tokenVisible ? "visibility-off" : "visibility"} // Change icon based on visibility
              type="material"
              color={isDarkTheme ? '#ffffff' : '#000000'}
              size={20}
            />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator color={isDarkTheme ? '#ffffff' : '#000000'} />
        ) : (
          <View style={tw`justify-center items-center`}>
            <TouchableOpacity
              style={tw`${
                isDarkTheme ? 'bg-white' : 'bg-black'
              } p-2 mt-4 rounded-full w-full items-center`}
              onPress={handleEditHome}
            >
              <Text style={tw`${isDarkTheme ? 'text-black' : 'text-white'}`}>
                {t('editHomeModal.editHomeTitle')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  )
}
